# Expanded MCP Server Catalog

This document lists additional MCP servers available for configuration in OpenCode. These servers extend capabilities into specialized areas like vector memory, advanced web scraping, and specific platform integrations.

## 🔍 Research & Browsing

### `fetch_crawl_firecrawl`
**Server:** `mcp/firecrawl`
**Purpose:** Advanced web scraping and crawling. Can turn websites into LLM-ready markdown.
**Type:** `command` (npx) or `docker`
**Command:** `npx -y firecrawl-mcp`
**Env Vars:**
- `FIRECRAWL_API_KEY`: Required (Get from Firecrawl or self-hosted)
- `FIRECRAWL_API_URL`: Optional (For self-hosted instances)
**Usage:**
```text
use fetch_crawl_firecrawl to scrape the entire documentation of fastapi
```

### `search_web_searxng`
**Server:** `OvertliDS/mcp-searxng-enhanced`
**Purpose:** Privacy-focused, category-aware web search using a SearXNG instance.
**Type:** `docker`
**Image:** `overtlids/mcp-searxng-enhanced:latest`
**Env Vars:**
- `SEARXNG_ENGINE_API_BASE_URL`: Required (e.g., `http://localhost:8080/search`)
- `DESIRED_TIMEZONE`: Optional (e.g., `America/New_York`)
**Usage:**
```text
use search_web_searxng to find recent news about AI models
```

### `browser_apify`
**Server:** `apify/apify-mcp-server`
**Purpose:** Headless web browser for RAG, capable of executing complex browser interactions via Apify Actors (specifically `apify/rag-web-browser`).
**Type:** `command` (npx)
**Command:** `npx -y apify-mcp-server`
**Env Vars:**
- `APIFY_TOKEN`: Required
**Usage:**
```text
use browser_apify to browse and extract data from a dynamic single-page application
```

## 📄 Content Processing

### `pdf_convert_marker`
**Server:** `xiaoyao9184/docker-marker`
**Purpose:** High-fidelity PDF to Markdown conversion. Handles equations, tables, and formatting better than standard extractors.
**Type:** `docker`
**Image:** `xiaoyao9184/marker`
**Usage:**
```text
use pdf_convert_marker to convert this academic paper to markdown
```

### `pdf_read_basic`
**Server:** `trafflux/pdf-reader-mcp`
**Purpose:** Lightweight PDF text extraction. Good for simple documents.
**Type:** `command` (npx)
**Command:** `npx -y @trafflux/pdf-reader-mcp`
**Usage:**
```text
use pdf_read_basic to read the invoice.pdf
```

## 🧠 Memory & Context

### `memory_vector_qdrant`
**Server:** `qdrant/mcp-server-qdrant`
**Purpose:** Semantic memory using Vector Database. Stores embeddings for similarity search.
**Type:** `command` (uvx) or `docker`
**Command:** `uvx mcp-server-qdrant`
**Env Vars:**
- `QDRANT_URL`: Required (e.g., `http://localhost:6333`)
- `QDRANT_API_KEY`: Required
- `COLLECTION_NAME`: Default `default-collection`
**Usage:**
```text
use memory_vector_qdrant to store these code snippets for semantic search
```

### `context_manager`
**Server:** `cyberchitta/llm-context.py`
**Purpose:** Manages project-specific context and rules.
**Type:** `command` (python)
**Command:** `lc-context` (Requires installation via pip/uv)
**Usage:**
```text
use context_manager to retrieve the project coding guidelines
```

## 🔌 Integrations

### `integration_aio`
**Server:** `athapong/aio-mcp`
**Purpose:** All-in-one integration for GitLab, Jira, Confluence, YouTube, and Google Maps.
**Type:** `command` (npx)
**Command:** `npx -y @athapong/aio-mcp`
**Env Vars:** Requires various API keys depending on services used (e.g., `GITLAB_TOKEN`, `JIRA_API_TOKEN`).
**Usage:**
```text
use integration_aio to search Jira tickets
```

### `integration_hackmd`
**Server:** `yuna0x0/hackmd-mcp`
**Purpose:** Read and write notes in HackMD.
**Type:** `command` (npx)
**Command:** `npx -y hackmd-mcp`
**Env Vars:**
- `HACKMD_API_TOKEN`: Required
**Usage:**
```text
use integration_hackmd to save this summary to a new note
```

### `github_manager`
**Server:** `kurdin/github-repos-manager-mcp`
**Purpose:** specialized GitHub repository management (list repos, get info, read content).
**Type:** `command` (npx)
**Command:** `npx -y github-repos-manager-mcp`
**Env Vars:**
- `GH_TOKEN`: Required
**Usage:**
```text
use github_manager to list all my private repositories
```

## 🛠️ Meta & Management

### `meta_magg`
**Server:** `sitbon/magg`
**Purpose:** MCP Aggregator. Allows managing and composing other MCP servers dynamically.
**Type:** `command` (python)
**Command:** `magg` (Requires installation)
**Usage:**
```text
use meta_magg to list active sub-servers
```

---

## Naming Convention Strategy

To avoid collisions and ensure clarity, we use a `category_capability_tool` format:

| Existing | New Proposed | Reason |
| :--- | :--- | :--- |
| `memory` | `memory_graph` (Alias) | Distinguishes Graph (relations) from Vector (embeddings). |
| (None) | `memory_vector_qdrant` | Explicitly identifies as Vector DB. |
| `duckduckgo` | `search_web_ddg` | Standardizes search tools. |
| (None) | `search_web_searxng` | Distinct local search option. |
| `fetch` | `fetch_simple` | Basic URL fetching. |
| (None) | `fetch_crawl_firecrawl` | Deep crawling capability. |
| (None) | `pdf_convert_marker` | Distinguishes high-fidelity conversion from simple reading. |
| (None) | `pdf_read_basic` | Simple text extraction. |
