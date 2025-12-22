# Glossary: AI Engineering & Agentic Development

**Date:** December 22, 2025
**Status:** Final Reference
**Scope:** Terminology for the "Develop with AI" ecosystem (Application Layer), excluding deep ML/Training jargon.

## 1. Agentic Architecture

**Agent**
An autonomous system capable of reasoning, planning, and executing multiple steps to achieve a high-level goal. Unlike a workflow, an agent determines its own control flow.
*   *Contrast with:* Expert, Workflow.
*   *Source:* Anthropic Research.

**Expert (or Worker)**
A specialized system (often an agent restricted by prompt/tools) designed to perform a specific, narrow task with high reliability. It has low agency and follows strict instructions.
*   *Example:* A "Git Commit Expert" that only stages and commits files.

**Orchestrator (or Manager)**
A central agent responsible for breaking down high-level user requests into sub-tasks and delegating them to Experts. It maintains the global state and plans the sequence of execution.

**Router**
A lightweight classification layer (often a small, fast model) that analyzes an incoming request and directs it to the most appropriate Agent or Expert.
*   *Goal:* Optimize cost and latency by not sending simple tasks to expensive models.

**Tool (or Function)**
A specific capability given to an LLM, such as "read_file", "web_search", or "execute_sql". The LLM outputs a structured request (JSON) to call the tool, which the system executes.

**ReAct (Reasoning + Acting)**
A prompting pattern where the model explicitly writes out a "Thought" (Reasoning) before taking an "Action" (Tool Call), and then observes the "Result".
*   *Pattern:* Thought -> Action -> Observation -> Thought...

## 2. Prompt Engineering & Context

**Chain of Thought (CoT)**
A technique where the model is prompted to "think step-by-step" before answering. This significantly improves performance on complex logic tasks by allowing the model to generate intermediate reasoning tokens.

**System Prompt**
The initial set of instructions (invisible to the end-user) that defines the AI's persona, constraints, and available tools. This is the "constitution" of the agent.

**Context Window**
The maximum amount of text (measured in tokens) the model can process at once. This includes the system prompt, conversation history, and any loaded files.
*   *Note:* "Context Stuffing" is the practice of filling this window with as much relevant data as possible.

**Few-Shot Prompting**
Providing the model with a few examples (shots) of the desired input-output format within the prompt to guide its behavior.
*   *Contrast with:* Zero-Shot (no examples).

**Hallucination**
When an LLM generates plausible-sounding but factually incorrect information.
*   *Mitigation:* RAG, Grounding, Low Temperature.

## 3. Data, Memory & Retrieval

**RAG (Retrieval-Augmented Generation)**
A pattern where the system first searches a database for relevant information (Retrieval) and then pastes that information into the prompt (Augmentation) for the LLM to answer (Generation).
*   *Goal:* Give the LLM access to private or up-to-date data it wasn't trained on.

**Embeddings**
A way of representing text as a list of numbers (vector) so that "meaning" can be compared mathematically. Similar concepts will have similar numbers.
*   *Use case:* Search, RAG.

**Vector Database**
A specialized database optimized for storing and searching Embeddings. It allows for "Semantic Search" (searching by meaning) rather than just keyword matching.

**Grounding**
The process of anchoring model outputs to verifiable sources or retrieved data to reduce hallucinations.

## 4. Model Parameters & Inference

**Inference**
The process of running a trained model to generate an output. This is what happens every time you send a message to the AI.

**Temperature**
A parameter (0.0 to 1.0) that controls the randomness of the output.
*   *Low (0.0 - 0.2):* Deterministic, focused, analytical. Good for code.
*   *High (0.7 - 1.0):* Creative, diverse, unpredictable. Good for brainstorming.

**Token**
The basic unit of text for an LLM. Roughly 0.75 words. Costs and limits are calculated in tokens.

**Top-P (Nucleus Sampling)**
An alternative to Temperature for controlling randomness. It limits the model to choosing from the top P% of most likely next words.

## 5. Development Patterns

**Evaluator-Optimizer**
A workflow where one agent generates a solution and a second agent (the Evaluator) critiques it. The first agent then optimizes the solution based on the critique.

**Human-in-the-Loop (HITL)**
A design pattern where the agent must pause and ask for human approval before executing critical actions (like deploying code or sending emails).
