# Research: The OpenCode Ecosystem

**Date:** December 22, 2025
**Status:** Final Report
**Scope:** Investigation into high-signal plugins, tools, and integrations surrounding the OpenCode project.

## Executive Summary

The OpenCode ecosystem has evolved beyond the core CLI into a rich set of integrations. The most significant discovery is **`oh-my-opencode`**, a "batteries-included" framework that appears to be the de-facto standard for power users, integrating many of the features you asked about (including Google Antigravity support).

## 1. High Signal: The "Must Haves"

### 🚀 oh-my-opencode
*   **Repo:** `code-yeongyu/oh-my-opencode`
*   **Description:** Self-described as "OpenCode on steroids." It is a comprehensive plugin framework that transforms OpenCode from a single-agent tool into a multi-agent orchestration system.
*   **Key Features:**
    *   **Async Sub-agents:** Runs agents in the background (non-blocking).
    *   **Google Antigravity Integration:** Native support for Google's "Antigravity" OAuth flow to access Gemini models.
    *   **Curated Tools:** Includes LSP (Language Server Protocol) and AST (Abstract Syntax Tree) tools out of the box.
    *   **Hooks System:** Allows for `PreToolUse`, `PostToolUse`, and `UserPromptSubmit` hooks (enabling things like analytics).

### 📋 VibeKanban
*   **Repo:** `BloopAI/vibe-kanban`
*   **Description:** A Kanban-based workflow manager designed specifically for AI coding agents.
*   **Philosophy:** Instead of a linear chat, it organizes tasks into a board. It includes a "Web Companion" that visualizes the agent's progress.
*   **Integration:** Works as a "companion" app that runs alongside OpenCode, likely communicating via local server or file watching.

## 2. Medium Signal: Power Tools & Configurations

### 🧠 Google Antigravity (Gemini)
*   **Context:** You mentioned finding this "organically." My research confirms that "Antigravity" is the specific OAuth/Authentication layer used to integrate Google's Gemini models into the OpenCode ecosystem.
*   **Why it matters:** It provides access to Google's high-context models (Gemini 1.5 Pro/Flash) which are often cheaper or faster than Anthropic/OpenAI equivalents for large codebases.
*   **How to use:** It is a core feature enabled by `oh-my-opencode`.

### 📊 OC Monitor (Analytics)
*   **Description:** A monitoring solution for OpenCode sessions.
*   **Function:** Tracks token usage, cost, and session duration.
*   **Ecosystem Fit:** Likely implemented using the `oh-my-opencode` hooks system (`PostToolUse` hooks) to log metrics to an external dashboard or local file.

## 3. Community Integrations

### 📱 Portal
*   **Repo:** `hosenur/portal`
*   **Description:** A mobile-first web UI for OpenCode.
*   **Use Case:** interacting with your coding agent from a phone/tablet via Tailscale/VPN.

### 🤖 Kimaki
*   **Repo:** `remorses/kimaki`
*   **Description:** A Discord bot wrapper for OpenCode.
*   **Use Case:** Collaborative coding sessions where multiple users can interact with the agent in a Discord channel.

### 📝 opencode.nvim
*   **Repo:** `sudo-tee/opencode.nvim`
*   **Description:** Neovim integration.
*   **Use Case:** For users who want the agent directly inside their editor rather than a separate terminal window.

## 4. Recommendations for Your Workflow

1.  **Adopt `oh-my-opencode`:** This seems to be the "missing link" that provides the architecture you are looking for (async agents, hooks, better tool management).
2.  **Explore VibeKanban:** If you feel "lost" in long chat threads, this visual board could be the operational upgrade you need.
3.  **Leverage Antigravity:** Continue using this for high-context tasks (reading entire repos) as Gemini's context window is massive.
