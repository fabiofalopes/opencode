# Research: Agent Sequencing and Dependency Management

**Date:** December 22, 2025
**Status:** Final Report
**Scope:** Investigation into enforcing sequential execution and dependencies between OpenCode agents.

## Executive Summary

OpenCode is designed with a "Parallel by Default" philosophy. The system prompt explicitly instructs agents to *"batch your tool calls together for optimal performance"* and *"run the calls in parallel"*. This behavior, while efficient for independent tasks, causes issues when Task B depends on the output of Task A.

There is currently **no native configuration** (e.g., `depends_on` in `opencode.json`) to enforce dependencies.

To achieve strict sequencing, you must use one of two patterns:
1.  **The Manager Pattern (Prompt-Based):** A primary agent explicitly instructed to execute step-by-step.
2.  **The Pipeline Pattern (Script-Based):** External orchestration using shell scripts.

## 1. System Analysis: Why Parallelism Happens

My analysis of `docs/prompts/system-prompt.md` revealed the root cause of the "parallel" behavior you observed. The system prompt contains explicit instructions:

> "You have the capability to call multiple tools in a single response. When multiple independent pieces of information are requested, batch your tool calls together for optimal performance."

> "When making multiple bash tool calls, you MUST send a single message with multiple tools calls to run the calls in parallel."

Furthermore, `docs/tools/Task.md` advises:
> "Launch multiple agents concurrently whenever possible, to maximize performance"

This means the "parallelism" is largely a **behavioral trait** of the model, driven by its instructions, rather than a hard constraint of the engine. The model *thinks* it should do everything at once to be efficient.

## 2. Solution A: The Manager Pattern (Recommended)

To force sequencing, you must override the default "batching" behavior using a specialized "Manager" agent. This agent does not do the work itself but orchestrates others.

**Implementation:**

1.  **Create a Manager Agent** in `opencode.json` (or use `deep`):
    ```json
    "manager": {
      "description": "Sequential workflow orchestrator",
      "model": "github-copilot/claude-sonnet-4.5",
      "tools": { "sequential_thinking": true, "task": true }
    }
    ```

2.  **Prompting Strategy:**
    When you give the command, you must explicitly forbid batching.

    *   **Bad Prompt:** "Research React patterns and then implement the auth component."
        *   *Result:* Model sees two tasks, launches `@research` and `@code` simultaneously.
    
    *   **Good Prompt (The Manager Prompt):**
        > "Perform this workflow **sequentially**. Do not batch tasks.
        > 1. Call @research to find React patterns. **WAIT** for the result.
        > 2. **ONLY AFTER** receiving the research, call @code to implement the auth component using those specific patterns.
        > 3. Verify the implementation."

3.  **Why this works:** It forces the LLM to generate *one* tool call, stop, wait for the system to return the output, and *then* generate the next thought/action.

## 3. Solution B: The Pipeline Pattern (Robust)

For highly repeatable workflows where dependencies are strict (e.g., CI/CD style), do not rely on the LLM's discipline. Use a shell script to chain OpenCode sessions.

**Implementation:**

Create a script `deploy-feature.sh`:

```bash
#!/bin/bash

# Step 1: Research (Output to file)
echo "🔍 Phase 1: Researching..."
opencode -m know "Research best practices for $1 and save to docs/specs/$1.md"

# Step 2: Plan (Read file, output plan)
echo "📋 Phase 2: Planning..."
opencode -m plan "Read docs/specs/$1.md and create a implementation plan in docs/plans/$1-plan.md"

# Step 3: Execute (Read plan, write code)
echo "💻 Phase 3: Coding..."
opencode -m build "Implement the feature following docs/plans/$1-plan.md"
```

**Why this works:** The operating system enforces the sequence. Step 2 literally cannot start until Step 1's process exits.

## 4. Future Roadmap

The `docs/opencode-multi-agent-analysis.md` document mentions a proposed **"Async Task Queue"** and **"Context Manager"** for Phase 2/3 of the architecture. These components would introduce a formal state machine to handle dependencies natively, removing the need for these workarounds.

## References
*   **System Prompt:** `docs/prompts/system-prompt.md` (Lines 64, 73)
*   **Task Tool:** `docs/tools/Task.md` (Line 35)
*   **Architecture Analysis:** `docs/opencode-multi-agent-analysis.md`
