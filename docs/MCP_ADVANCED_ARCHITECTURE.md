# Advanced MCP Architecture & Management

This document details the advanced modular configuration system for managing MCP servers in OpenCode.

## Overview

As the number of MCP servers grows, managing them in a single `opencode.json` file becomes unwieldy. We have adopted a **Modular Configuration Strategy** that allows for:

1.  **Separation of Concerns:** Grouping servers by function (Research, Coding, Memory, etc.).
2.  **Easy Toggling:** Enabling/disabling servers via CLI without editing massive JSON files.
3.  **Advanced Capabilities:** Integrating local Vector DBs, Knowledge Graphs, and LLM bridges.

## Directory Structure

Configuration is now managed in `~/.config/opencode/mcp-config/`:

```
mcp-config/
├── core.json          # Essential tools (context7, gh_grep, fetch)
├── research.json      # Research tools (arxiv, wikipedia, paper_search)
├── coding.json        # Coding tools (code_interpreter, github)
├── memory.json        # Memory tools (memory, sequential_thinking)
├── experimental.json  # Optional/Paid tools (brave, perplexity, obsidian)
└── advanced.json      # Advanced/Local AI (ollama, qdrant, neo4j)
```

## Management Script

A TypeScript script `scripts/manage-mcp.ts` handles the generation of the final `opencode.json`.

### Usage

**Rebuild Configuration:**
Merges all JSON files in `mcp-config/` into `opencode.json`.
```bash
npx ts-node scripts/manage-mcp.ts build
```

**Enable a Server:**
```bash
npx ts-node scripts/manage-mcp.ts enable perplexity
```

**Disable a Server:**
```bash
npx ts-node scripts/manage-mcp.ts disable brave
```

## Advanced MCP Servers (Docker-based)

We have identified and configured placeholders for advanced local AI capabilities. These are **disabled by default** in `advanced.json` but can be enabled when the underlying services are running.

### 1. Local LLM Bridge (Ollama)
-   **Server:** `ollama-mcp-server`
-   **Purpose:** Connects local LLMs (via Ollama) to MCP.
-   **Requirement:** Run `ollama serve` locally.

### 2. Vector Database Memory (Qdrant)
-   **Server:** `delorenj/mcp-qdrant-memory`
-   **Purpose:** Semantic search and long-term memory using vector embeddings.
-   **Requirement:** Run Qdrant via Docker:
    ```bash
    docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
    ```

### 3. Knowledge Graph (Neo4j)
-   **Server:** `mcp/neo4j-memory`
-   **Purpose:** Structured knowledge graph for complex relationship mapping.
-   **Requirement:** Run Neo4j via Docker:
    ```bash
    docker run -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:latest
    ```

## Workflow for Adding New Servers

1.  Create a new JSON file in `mcp-config/` (e.g., `custom.json`) OR add to an existing category.
2.  Define the server configuration (Docker command, env vars).
3.  Run `npx ts-node scripts/manage-mcp.ts build`.
4.  Restart OpenCode (if necessary) to pick up changes.
