# Hub - Reference Links

Useful repos for inspiration. Clone what you need, when you need it.

## Agent Prompts & Examples

| Repo | What's There |
|------|--------------|
| [agentic-system-prompts](https://github.com/tallesborges/agentic-system-prompts) | Claude Code, Aider, Cline system prompts |
| [awesome-ai-system-prompts](https://github.com/dontriskit/awesome-ai-system-prompts) | AI system prompt collection |
| [Prompt_Engineering](https://github.com/NirDiamant/Prompt_Engineering) | Prompt engineering patterns |
| [cursor-commands](https://github.com/hamzafer/cursor-commands) | Cursor IDE commands |

## MCP Servers

| Repo | Notes |
|------|-------|
| [perplexity-official](https://github.com/perplexityai/modelcontextprotocol) | We run this locally (not docker) |
| [mcp-servers](https://github.com/modelcontextprotocol/servers) | Official MCP server collection |

## Our MCP Setup

All servers configured in `opencode.json`. Summary:

| Server | Type | Notes |
|--------|------|-------|
| context7 | npx | `@dolasoft/stdio-context7-mcp-server` |
| gh_grep | remote | `https://mcp.grep.app` |
| duckduckgo | docker | `mcp/duckduckgo` |
| fetch | docker | `mcp/fetch` |
| wikipedia | docker | `mcp/wikipedia` |
| memory | docker | `mcp/memory` + `~/mcp-memory/` |
| code_interpreter | docker | `mcp/code-interpreter` + `~/mcp-code/` |
| sequential_thinking | npx | `@modelcontextprotocol/server-sequential-thinking` |
| arxiv | docker | `mcp/arxiv` + `~/arxiv-papers/` |
| paper_search | docker | `ghcr.io/pickleton89/paper-search-mcp` |
| hackernews | docker | `mcp/hackernews` |
| perplexity | local | **Run from source** (see below) |

### Perplexity Setup (Local Install)

```bash
# Clone to hub/mcp-servers/
cd ~/.config/opencode/hub
mkdir -p mcp-servers
git clone https://github.com/perplexityai/modelcontextprotocol.git mcp-servers/perplexity-official

# Install
cd mcp-servers/perplexity-official/perplexity-ask
npm install && npm run build
```

Requires `PERPLEXITY_API_KEY` env var.

## Data Directories

MCP servers that persist data:

```
~/mcp-memory/     # Knowledge graph (memory server)
~/mcp-code/       # Code interpreter workspace
~/arxiv-papers/   # Downloaded papers
```
