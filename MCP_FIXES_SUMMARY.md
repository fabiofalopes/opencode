# MCP Configuration Fixes Applied

## Issues Found and Fixed

### 1. ✅ Fixed Environment Variable Syntax
**Problem**: Docker commands had incorrect inline environment variable syntax like `-e VAR_NAME={env:VAR_NAME}`

**Fixed**: Changed to proper Docker syntax:
```diff
  "-e",
  "FIRECRAWL_API_KEY={env:FIRECRAWL_API_KEY}",
+ "-e",
+ "FIRECRAWL_API_KEY",
  "mcp/firecrawl"
```

With separate `environment` section:
```json
"environment": {
  "FIRECRAWL_API_KEY": "{env:FIRECRAWL_API_KEY}"
}
```

**Affected servers:**
- ✅ `research_scraper_firecrawl`
- ✅ `research_search_searxng`
- ✅ `memory_vector_qdrant`

---

### 2. ✅ Fixed File Paths (Linux vs macOS)
**Problem**: Paths were pointing to macOS locations (`/Users/fabiofalopes/`) but you're on Linux.

**Fixed**: Updated to Linux paths (`/home/fabio/`):
- `code_interpreter`: `/Users/fabiofalopes/mcp-code` → `/home/fabio/mcp-code`
- `memory`: `/Users/fabiofalopes/mcp-memory` → `/home/fabio/mcp-memory`
- `arxiv`: `/Users/fabiofalopes/arxiv-papers` → `/home/fabio/arxiv-papers`

---

### 3. ✅ Created Missing Data Directories
```bash
mkdir -p ~/mcp-code ~/mcp-memory ~/arxiv-papers
```

---

### 4. ✅ Increased PDF Marker Timeout
**Problem**: Marker image processing can be slow, causing timeouts.

**Fixed**: Increased timeout from 60s to 120s:
```json
"timeout": 120000  // 2 minutes
```

---

## What You Need to Do

### 🔄 RESTART OPENCODE
The configuration has been rebuilt. You MUST restart OpenCode for changes to take effect.

1. Stop OpenCode (if running)
2. Start OpenCode again

---

### 📝 Check Your .env File
Ensure your environment variables are **not commented out**:

```bash
# ❌ WRONG (commented out):
#PERPLEXITY_API_KEY='your-key'
#FIRECRAWL_API_KEY='your-key'

# ✅ CORRECT (uncommented):
PERPLEXITY_API_KEY='your-key'
FIRECRAWL_API_KEY='your-key'
QDRANT_URL='https://your-cluster.qdrant.tech'
QDRANT_API_KEY='your-key'
SEARXNG_BASE_URL='http://localhost:8080'
```

**Required variables:**
- `FIRECRAWL_API_KEY` - for research_scraper_firecrawl
- `QDRANT_URL` + `QDRANT_API_KEY` - for memory_vector_qdrant
- `SEARXNG_BASE_URL` - for research_search_searxng
- `PERPLEXITY_API_KEY` - for perplexity (optional)

---

## Expected Results After Restart

### ✅ Should Connect Successfully:
- `research_search_searxng` - SeXNG (requires SEARXNG_BASE_URL env var)
- `research_scraper_firecrawl` - Firecrawl (requires FIRECRAWL_API_KEY env var)
- `memory_vector_qdrant` - Qdrant (requires QDRANT_URL + QDRANT_API_KEY env vars)
- `content_pdf_marker` - Marker (Docker image, no env vars needed)
- `content_pdf_reader` - PDF Reader (NPM package, no env vars needed)
- `perplexity` - Perplexity (requires PERPLEXITY_API_KEY env var)

### ❌ Disabled by Design (no issue):
- `ollama_bridge` - disabled
- `qdrant_mcp` - disabled (old version)
- `neo4j_mcp` - disabled
- `github` - disabled (requires token)
- `brave` - disabled (requires API key)
- `obsidian` - disabled (requires setup)
- All integration servers - disabled

---

## Troubleshooting

If servers still fail after restart:

1. **Check environment variables:**
   ```bash
   env | grep -E 'FIRECRAWL|QDRANT|SEARXNG|PERPLEXITY'
   ```

2. **Check Docker is running:**
   ```bash
   docker ps
   ```

3. **Verify services are accessible:**
   ```bash
   # SeXNG
   curl http://localhost:8080

   # Qdrant (if cloud)
   curl https://your-cluster.qdrant.tech/health
   ```

4. **Check logs in OpenCode MCP status panel**

---

## Architecture Reference

Your configuration now follows the proper modular structure:
- `opencode.base.json` - Source of truth (empty `mcp: {}` section)
- `mcp-config/*.json` - Modular server definitions
- `opencode.json` - Generated file (DO NOT EDIT MANUALLY)

**To make changes:**
1. Edit `mcp-config/<category>.json`
2. Run: `npx ts-node scripts/manage-mcp.ts build`
3. Restart OpenCode
