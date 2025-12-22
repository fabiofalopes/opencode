# Research: Agentic Engineering Resources & Patterns

**Date:** December 22, 2025
**Status:** Final Report
**Scope:** Curated high-signal resources and definitions for building effective multi-agent systems.

## Executive Summary: Agent vs. Expert

You asked for a clear distinction between "Agents" and "Experts" to avoid confusion. Based on the industry standard definitions (Anthropic, Andrew Ng):

*   **The Expert (Workflow):** A system with **high competence but low agency**. It follows a strict, predefined path to solve a specific problem (e.g., "Write a SQL query"). It does not decide *what* to do, only *how* to do its specific task well.
*   **The Agent (Orchestrator):** A system with **high agency**. It decides which Experts to call, in what order, and how to handle errors. It maintains the "Big Picture".

**The Golden Rule:**
> "Start with a Workflow (Expert). Only add Agency (Agent) when the workflow becomes too complex to script." — *Anthropic Research*

## 1. Core Design Patterns

To build a "good company of agents," avoid generic "chatbots." Instead, implement these proven architectural patterns.

### A. The Orchestrator-Workers Pattern (The "Company" Structure)
*   **Concept:** A central "Manager" (Orchestrator) breaks down a high-level goal and delegates sub-tasks to "Workers" (Experts).
*   **Why it works:** It separates **Reasoning** (Planning) from **Execution** (Coding/Research).
*   **Example:**
    *   `Manager`: "We need a new login page." (Breaks it down)
    *   `Worker A (Research)`: Finds auth libraries.
    *   `Worker B (Code)`: Writes the React component.
    *   `Manager`: Reviews and merges.

### B. The Evaluator-Optimizer Pattern (The "QA" Loop)
*   **Concept:** One agent generates a solution, and a second agent critiques it. The first agent then improves it based on feedback.
*   **Why it works:** LLMs are better at verifying solutions than generating perfect ones on the first try.
*   **Example:**
    *   `Coder`: Writes a function.
    *   `Reviewer`: "You missed an edge case for null inputs."
    *   `Coder`: Fixes it.

### C. The Router Pattern
*   **Concept:** A lightweight gateway that classifies a request and sends it to the most specialized (and often cheaper) agent.
*   **Why it works:** Prevents "Jack of all trades, master of none."

## 2. The "12-Factor Agent" Principles

Derived from the "12-Factor App" methodology, these are the modern standards for reliable agent engineering.

1.  **Small, Focused Agents:** An agent should do *one* thing well (e.g., "Git Commit Agent", not "General Developer Agent").
2.  **Own Your Control Flow:** Don't let the LLM guess the loop. Script the workflow where possible.
3.  **Tools are Structured Outputs:** Don't parse regex. Use JSON schemas for reliable tool calling.
4.  **Stateless Reducers:** Agents should take context in, produce an action, and exit. Avoid maintaining massive internal state.

## 3. Curated High-Signal Resources

I have filtered out the generic "AI hype" to leave only the engineering-grade resources.

### The "Bible" of Agent Engineering
*   **[Building Effective Agents (Anthropic)](https://www.anthropic.com/research/building-effective-agents)**
    *   *Why:* The definitive guide on when to use Workflows vs. Agents. Defines the patterns above.
    *   *Key Takeaway:* "Complexity is a liability. Start simple."

### The "Manifesto"
*   **[12-Factor Agents (GitHub)](https://github.com/humanlayer/12-factor-agents)**
    *   *Why:* Practical, production-ready principles for building reliable agents.
    *   *Key Takeaway:* Treat agents as software components, not magic boxes.

### The "Philosophy"
*   **[Andrew Ng on Agentic Workflows (YouTube/DeepLearning.AI)](https://www.youtube.com/watch?v=sal78ACtGTc)**
    *   *Why:* Explains why "Agentic Workflows" (iterative improvement) yield better results than just using a "smarter model."
    *   *Key Takeaway:* GPT-3.5 in a loop > GPT-4 zero-shot.

### The "Security"
*   **[Prompt Injection Design Patterns (Simon Willison)](https://simonwillison.net/2024/Jun/13/prompt-injection-design-patterns/)**
    *   *Why:* Essential reading for keeping your agents safe from malicious inputs.

## 4. Practical Advice for OpenCode

Based on these findings, here is how you should configure your OpenCode agents:

1.  **Define "Experts" as Sub-Agents:**
    *   Create `@git`, `@test`, `@docs` agents with *very narrow* system prompts and limited toolsets.
    *   *Example:* The `@git` agent should only have `git` tools, not `web_search`.

2.  **Define "Agents" as Primary Modes:**
    *   Your `deep` and `build` agents are the Orchestrators. They have access to the Sub-Agents.

3.  **Prompting:**
    *   **Too Verbose:** Explaining *how* to think (e.g., "You are a smart AI...").
    *   **Just Right:** Defining the **Input**, **Output**, and **Constraints** (e.g., "Input: A file path. Output: A list of functions. Constraint: Do not read other files.").
