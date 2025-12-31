# MCP Server Performance & Reliability Issues

**Date**: December 31, 2025
**Status**: CRITICAL - Not Functional
**Last Updated**: 2025-12-31

---

## 🚨 Critical Issues

### 1. Extreme Latency in MCP Server Loading
- **Symptom**: OpenCode takes 5-10+ minutes to display MCP servers
- **Symptom**: Servers appear as "loading" or "connecting" indefinitely
- **Symptom**: UI becomes unresponsive during MCP initialization
- **Impact**: System is unusable for first 5-10 minutes after startup

### 2. Connection Timeouts and Errors
```
MCP error -32001: Request timed out
MCP error -32000: Connection closed
```
- **Affected servers**:
  - `content_pdf_marker` - consistently times out
  - `content_pdf_reader` - connection issues
  - `perplexity` - connection closed
  - `memory_vector_qdrant` - connection closed
  - `research_scraper_firecrawl` - connection closed
  - `research_search_searxng` - connection closed

### 3. Servers Marked as "Disabled in Configuration" But Config Shows `enabled: true`
- **Symptom**: OpenCode shows servers as disabled even though `enabled: true` in config
- **Possible causes**:
  - Docker container startup failures
  - Missing environment variables
  - MCP client initialization timeouts
  - Race conditions in server discovery

---

## 📊 Current Server Status

### Working (✅)
- `code_interpreter` - Connected
- `context7` - Connected
- `gh_grep` - Connected
- `duckduckgo` - Connected
- `fetch` - Connected
- `sequential_thinking` - Connected
- `memory` - Connected
- `wikipedia` - Connected
- `arxiv` - Connected
- `paper_search` - Connected
- `hackernews` - Connected

### Broken/Timeout (❌)
- `content_pdf_marker` - MCP error -32001: Request timed out
- `content_pdf_reader` - MCP error -32000: Connection closed
- `perplexity` - MCP error -32000: Connection closed
- `memory_vector_qdrant` - MCP error -32000: Connection closed
- `research_scraper_firecrawl` - MCP error -32000: Connection closed
- `research_search_searxng` - MCP error -32000: Connection closed

### Disabled by Design (⏸️)
- `ollama_bridge` - disabled
- `qdrant_mcp` - disabled
- `neo4j_mcp` - disabled
- `github` - disabled (needs token)
- `brave` - disabled (needs API key)
- `obsidian` - disabled (needs setup)
- `integration_suite_aio` - disabled
- `integration_notes_hackmd` - disabled
- `integration_github_repos` - disabled
- `meta_aggregator_magg` - disabled
- `context_manager_llm` - disabled
- `research_browser_rag` - disabled

---

## 🔍 Root Cause Analysis

### Docker-Based Servers Are Failing

**Hypothesis 1: Docker Image Issues**
- Marker image may require GPU resources
- Some images may be outdated or incompatible
- Docker run commands may be missing required volume mounts or environment variables

**Hypothesis 2: Environment Variable Issues**
- `.env` file format problems
- Variables not being passed to Docker containers correctly
- Missing or invalid API keys

**Hypothesis 3: Docker Resource Constraints**
- Docker daemon may be running out of resources
- Container startup timeouts
- Network mode issues (host vs bridge)

### Performance Issues

**Hypothesis 1: MCP Client Initialization**
- Too many MCP servers trying to initialize simultaneously
- No parallelization or timeout management
- Single-threaded server discovery

**Hypothesis 2: Docker Overhead**
- Starting 10+ Docker containers takes significant time
- No connection pooling
- Each server spawns a new Docker process

---

## 🛠️ Investigation Checklist

### Immediate Checks (5 min)
- [ ] Verify Docker is running: `docker ps`
- [ ] Check Docker resources: `docker stats`
- [ ] Verify .env file format (no comments, no trailing commas)
- [ ] Check individual Docker images can start:
  ```bash
  docker run --rm mcp/wikipedia-mcp  # should exit cleanly
  docker run --rm mcp/sequentialthinking
  ```
- [ ] Test SeXNG directly: `curl http://localhost:8080`
- [ ] Test Qdrant connectivity: `curl https://your-cluster.qdrant.tech/health`

### Detailed Debugging (30 min)
- [ ] Run OpenCode with verbose logging
- [ ] Check MCP initialization order and timing
- [ ] Monitor Docker container startup logs:
  ```bash
  docker logs <container_id> --tail 100
  ```
- [ ] Test individual servers by enabling one at a time
- [ ] Benchmark Docker image pull times
- [ ] Check for port conflicts:
  ```bash
  netstat -tuln | grep -E '8080|6333'
  ```

### Performance Optimization Ideas
- [ ] Lazy-load MCP servers (only start when first used)
- [ ] Parallel server initialization
- [ ] Add connection timeouts (fail fast)
- [ ] Use connection pooling
- [ ] Cache server connections across sessions
- [ ] Reduce Docker image count by combining related servers

---

## 📁 Configuration Files State

### opencode.base.json
- ✅ Clean - no MCP servers (as intended)
- ✅ Uses modular system

### mcp-config/*.json (Source of Truth)
- `advanced.json` - 3 servers (ollama_bridge, qdrant_mcp, neo4j_mcp)
- `coding.json` - 2 servers (code_interpreter, github)
- `content.json` - 2 servers (content_pdf_marker, content_pdf_reader)
- `core.json` - 4 servers (context7, gh_grep, duckduckgo, fetch)
- `experimental.json` - 3 servers (brave, perplexity, obsidian)
- `integrations.json` - 3 servers (suite_aio, hackmd, github_repos)
- `memory.json` - 3 servers (sequential_thinking, memory, memory_vector_qdrant)
- `meta.json` - 2 servers (magg, context_manager_llm)
- `research.json` - 5 servers (wikipedia, arxiv, paper_search, hackernews, firecrawl, searxng, rag_browser)

### opencode.json
- ⚠️ Generated file - DO NOT EDIT MANUALLY
- ✅ Built from modular configs
- ⚠️ Needs rebuild after any source changes: `npx ts-node scripts/manage-mcp.ts build`

---

## 🔧 Known Configuration Issues

### 1. PDF Marker Needs More Time
**File**: `mcp-config/content.json`
**Issue**: Processing large PDFs takes >60 seconds
**Current Fix**: Set timeout to 120000ms (2 minutes)
**Status**: Applied

### 2. Docker Environment Variable Syntax
**Files**: `mcp-config/research.json`, `mcp-config/memory.json`
**Issue**: Was using inline `-e VAR={env:VAR}` syntax
**Current Fix**: Separate `-e VAR` from `environment: { VAR: "{env:VAR}" }`
**Status**: Applied

### 3. macOS vs Linux Paths
**Files**: `mcp-config/coding.json`, `mcp-config/memory.json`, `mcp-config/research.json`
**Issue**: Paths like `/Users/fabiofalopes/` instead of `/home/fabio/`
**Current Fix**: Updated to Linux paths
**Status**: Applied

---

## 📝 Environment Variables Required

Create/update `/home/fabio/.config/opencode/.env`:

```bash
# Required for Firecrawl
FIRECRAWL_API_KEY=fc-your-key-here

# Required for Qdrant vector memory
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-key

# Required for SeXNG search
SEARXNG_BASE_URL=http://localhost:8080

# Optional but recommended
PERPLEXITY_API_KEY=pplx-your-key-here
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your-token-here
```

**Important**: No comments (`#`) or trailing commas in `.env` file format.

---

## 🎯 Next Steps

### High Priority (Fix Before Next Use)
1. Debug why Docker-based servers are failing to connect
2. Optimize MCP server initialization performance
3. Add proper logging/monitoring

### Medium Priority (Next Week)
1. Implement lazy-loading for MCP servers
2. Add health checks for each server
3. Create dashboard showing server status and latency

### Low Priority (Later)
1. Consolidate Docker images where possible
2. Implement connection pooling
3. Add automatic retry with backoff

---

## 📞 Related Files

- `/home/fabio/.config/opencode/opencode.json` - Generated config
- `/home/fabio/.config/opencode/opencode.base.json` - Base config
- `/home/fabio/.config/opencode/mcp-config/*.json` - Modular configs
- `/home/fabio/.config/opencode/.env` - Environment variables
- `/home/fabio/.config/opencode/scripts/manage-mcp.ts` - Build script
- `/home/fabio/.config/opencode/scripts/validate-config.ts` - Validation script

---

## 🏷️ Tags

#mcp #performance #docker #critical #needs-fix #laggy #timeouts
