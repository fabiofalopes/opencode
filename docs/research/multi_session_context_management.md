# Research: Multi-Session Context Management & Token-Boxing

**Date:** December 22, 2025
**Status:** Final Report
**Scope:** Strategies for managing context across multiple sessions ("Sprints") to prevent degradation and hallucinations.

## Executive Summary

Your hypothesis is correct and aligns with the cutting edge of Agentic Engineering. The concept you described—treating a session as a "Sprint" or "Ticket" with a clean context slate—is becoming a standard pattern to combat **Context Drift** (the tendency of agents to get confused as the conversation grows).

We found two specific tools that implement this exact philosophy: **VibeTape** (Context Handoffs) and **Claude Code Tresor** (Workflow Scripts).

## 1. The Philosophy: Token-Boxed Sprints

Instead of one infinite chat, we define a **Token-Boxed Sprint**:

*   **The Unit:** One Session = One Task (Ticket).
*   **The Constraint:** The task *must* be solvable within the model's "Reasoning Window" (not just its Context Window).
*   **The Handoff:** A structured artifact passed from Session A to Session B.

### Why "Huge Context" (Antigravity) Isn't Enough
Even though Google's Gemini (Antigravity) has a 1M+ token window, research shows that **Reasoning Density** decreases as context fills up (the "Lost in the Middle" phenomenon).
*   **Capacity:** Can it *fit* the text? Yes.
*   **Competence:** Can it *reason* about it effectively? No.
*   **Conclusion:** You still need to split sessions for complex logic, even if you don't need to split them for storage.

## 2. The "Baton" Mechanisms (Context Handoff)

How do we pass the "brain" from one agent to the next without passing the "bloat"?

### Level 1: The "Transition Card" (VibeTape Pattern)
**Tool:** `sambaleuk/Vibetape-MCP-Server`
*   **Concept:** An MCP server that records "Moments" and generates a **Context Handoff** artifact.
*   **Mechanism:**
    1.  Agent works on Task A.
    2.  Before exiting, Agent calls `generate_context_handoff`.
    3.  VibeTape creates a compressed summary (approx. 350 tokens) + links to key decisions.
    4.  Agent B starts with `handoff://{id}` in its system prompt.
*   **Benefit:** Automated "Denoising" (removing "Ok, thanks" and failed attempts).

### Level 2: The "Workflow Script" (Tresor Pattern)
**Tool:** `alirezarezvani/claude-code-tresor`
*   **Concept:** Shell scripts that enforce the "Manager Pattern".
*   **Mechanism:**
    *   Command `/handoff-create`: Scans the current state and writes a `handoff.md` file.
    *   Command `/prompt-run`: Starts a new session injecting `handoff.md` as context.
*   **Benefit:** Zero-dependency (just Markdown files).

### Level 3: The "Knowledge Graph" (Memory Pattern)
**Tool:** `mcp/memory` (Native)
*   **Concept:** Storing entities and relations.
*   **Mechanism:**
    *   Session A writes: `create_entities([{name: "AuthSystem", observations: ["Uses JWT", "Secret is in .env"]}])`
    *   Session B reads: `search_nodes("AuthSystem")`
*   **Benefit:** Non-linear access. Session B only pulls what it needs.

## 3. Implementation Strategy for OpenCode

To implement your "Sprint" idea today:

### Step 1: Define the "Exit Definition of Done"
Add this to your System Prompt (or `.clinerules`):
> "When the task is complete, you MUST run the `create_handoff` tool (or write to `docs/handoffs/latest.md`). This file must contain:
> 1. What was achieved.
> 2. What is broken/pending.
> 3. Key architectural decisions made.
> 4. List of modified files."

### Step 2: The "Sprint" Workflow
1.  **Start Session:** `opencode -m build "Read docs/handoffs/latest.md and start ticket #123"`
2.  **Work:** Agent executes task.
3.  **End Session:** Agent writes `docs/handoffs/ticket-123-done.md`.
4.  **Reset:** You kill the terminal/session. Context is cleared.

## 4. References
*   **VibeTape:** `github.com/sambaleuk/Vibetape-MCP-Server` (The "Handoff" tool).
*   **Tresor:** `github.com/alirezarezvani/claude-code-tresor` (The "Workflow" scripts).
*   **Theory:** "Context Distillation" papers (Anthropic/OpenAI).
