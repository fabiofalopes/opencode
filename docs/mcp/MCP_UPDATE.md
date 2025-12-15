# MCP Servers Update

## ✅ All MCP Servers Now Configured

Your opencode.json now includes ALL available MCP servers from Docker Hub MCP toolkit.

### Complete MCP Server List (15 total)

#### ✅ Enabled (11 servers)

1. **context7** - Library documentation
   - Command: `npx -y @dolasoft/stdio-context7-mcp-server`
   - Tools: 2

2. **gh_grep** - GitHub code search
   - URL: `https://mcp.grep.app` (remote)
   - Tools: 1

3. **duckduckgo** - Web search
   - Command: `docker run -i --rm mcp/duckduckgo`
   - Tools: 2

4. **fetch** - Web content fetching
   - Command: `docker run -i --rm mcp/fetch`
   - Tools: 1

5. **wikipedia** - Wikipedia access
   - Command: `docker run -i --rm mcp/wikipedia-mcp`
   - Tools: 10

6. **memory** - Knowledge graph storage
   - Command: `docker run -i --rm -v ~/mcp-memory:/data mcp/memory`
   - Tools: 9

7. **code_interpreter** - Python execution
   - Command: `docker run -i --rm -v ~/mcp-code:/workspace mcp/mcp-code-interpreter`
   - Tools: 1

8. **sequential_thinking** - Structured reasoning
   - Command: `docker run -i --rm mcp/sequentialthinking`
   - Tools: 1

9. **arxiv** - Research papers
   - Command: `docker run -i --rm -v ~/arxiv-papers:/papers mcp/arxiv-mcp-server`
   - Tools: 4

10. **paper_search** - Multi-source papers
    - Command: `docker run -i --rm mcp/paper-search`
    - Tools: 15

11. **hackernews** - Hacker News 🆕
    - Command: `docker run -i --rm mcp/hackernews-mcp`
    - Tools: 4

#### ❌ Disabled (4 servers - require API keys)

12. **brave** - Brave search
    - Requires: `BRAVE_API_KEY`
    - Tools: 5

13. **github** - GitHub API
    - Requires: `GITHUB_PERSONAL_ACCESS_TOKEN`
    - Tools: 40+

14. **perplexity** - Perplexity AI
    - Requires: `PERPLEXITY_API_KEY`
    - Tools: 3

15. **obsidian** - Obsidian vault
    - Requires: `OBSIDIAN_HOST`, `OBSIDIAN_API_KEY`
    - Tools: 12

### What Changed

✅ Added **hackernews** MCP server
✅ Updated all documentation
✅ Added to build, plan, and research agents
✅ JSON validated successfully

### Hacker News Tools

```python
# Get top stories
mcp_hackernews_get_top_stories(limit=10)

# Get specific story
mcp_hackernews_get_story(id=12345678)

# Search stories
mcp_hackernews_search_stories(query="AI agents", limit=20)

# Get user info
mcp_hackernews_get_user(username="pg")
```

### Usage in Agents

**build agent** - Has access to hackernews
**plan agent** - Has access to hackernews
**research agent** - Has access to hackernews

### How to Use

```txt
use hackernews to get top tech stories
use hackernews to search for discussions about AI
use hackernews to get story 12345678
```

### Enable Disabled Servers

To enable servers that require API keys:

**GitHub:**
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
# Edit opencode.json: "github": { "enabled": true }
```

**Brave:**
```bash
export BRAVE_API_KEY=...
# Edit opencode.json: "brave": { "enabled": true }
```

**Perplexity:**
```bash
export PERPLEXITY_API_KEY=...
# Edit opencode.json: "perplexity": { "enabled": true }
```

**Obsidian:**
```bash
export OBSIDIAN_HOST=host.docker.internal
export OBSIDIAN_API_KEY=...
# Edit opencode.json: "obsidian": { "enabled": true }
```

### Verification

```bash
# Validate JSON
cat opencode.json | python3 -m json.tool

# Start OpenCode
opencode

# Test hackernews
use hackernews to get top stories
```

### Summary

- **Total MCP servers**: 15
- **Enabled**: 11
- **Disabled**: 4 (need API keys)
- **Total tools**: 50+
- **New addition**: Hacker News (4 tools)

All MCP servers from Docker Hub MCP toolkit are now properly configured in your opencode.json! 🎉
