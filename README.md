# opencode

> Personal [OpenCode](https://opencode.ai) configuration — not the OpenCode project itself.

My `~/.config/opencode/` setup featuring a hierarchical multi-agent system, 11 MCP servers, and custom tools.

## Quick Start

```bash
# Clone the repo (folder name matches required config location)
git clone https://github.com/fabiofalopes/opencode.git ~/.config/opencode

# Set up environment variables
cp ~/.config/opencode/.env.example ~/.config/opencode/.env
# Edit .env with your API keys

# Use OpenCode from any project directory
cd ~/your-project
opencode
```

## Agent System

### Primary Agents (Tab to switch)

| Agent | Purpose | Model |
|-------|---------|-------|
| **build** | Full development with all tools | claude-sonnet-4.5 |
| **deep** | Analyze-first builder with balanced agency | claude-sonnet-4.5 |
| **plan** | Analysis and planning without modifications | claude-haiku-4.5 |
| **know** | Knowledge building and research workflows | claude-opus-4.5 |

### Subagents (@ mention)

| Agent | Purpose | Model |
|-------|---------|-------|
| **@code** | Code development with GitHub integration | gpt-5.1-codex |
| **@research** | Information gathering from multiple sources | claude-opus-4.5 |
| **@thinking** | Problem solving with structured reasoning | claude-sonnet-4.5 |

### When to Use Each Agent

```
build     → Day-to-day development, full autonomy
deep      → Complex tasks needing analysis before action
plan      → Explore options without making changes
know      → Research that builds persistent knowledge

@code     → Delegate pure coding tasks
@research → Delegate deep research
@thinking → Delegate complex reasoning
```

## Directory Structure

```
~/.config/opencode/
├── opencode.json              # Main configuration
├── AGENTS.md                  # Agent instructions (auto-loaded)
├── .opencode/
│   ├── agent/                 # Agent definitions (7 agents)
│   │   ├── build.md           # Primary - Full development
│   │   ├── deep.md            # Primary - Analyze-first builder
│   │   ├── plan.md            # Primary - Analysis only
│   │   ├── know.md            # Primary - Knowledge builder
│   │   ├── code.md            # Subagent - Code focused
│   │   ├── research.md        # Subagent - Research
│   │   └── thinking.md        # Subagent - Problem solving
│   └── tool/                  # Custom TypeScript tools
│       ├── analyze.ts         # Code complexity analysis
│       ├── fabric.ts          # Fabric AI patterns
│       ├── git-info.ts        # Git status/diff
│       └── project-info.ts    # Project structure/deps
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # System design
│   ├── AGENT_MATRIX.md        # Agent selection guide
│   ├── MCP_TOOLS.md           # MCP reference
│   └── ...
├── hub/                       # Reference links & MCP notes
│   └── README.md              # Useful repos + MCP setup info
└── archive/                   # Historical files (gitignored)
```

## MCP Servers

11 enabled servers providing 50+ tools:

| Category | Servers | Tools |
|----------|---------|-------|
| **Research** | context7, wikipedia, duckduckgo, fetch | Library docs, web search |
| **Academic** | arxiv, paper_search | Research papers |
| **Code** | gh_grep, code_interpreter | GitHub search, Python exec |
| **Cognitive** | sequential_thinking, memory | Reasoning, knowledge graph |
| **News** | hackernews | Tech discussions |

## Custom Tools

| Tool | Description |
|------|-------------|
| `git-info` | Git status and diff |
| `analyze` | Code complexity metrics |
| `project-info` | Structure and dependencies |
| `fabric` | AI pattern processing |

## Key Features

- **Hierarchical agents**: Primary agents can delegate to specialized subagents
- **Balanced agency**: `deep` agent thinks before acting, confirms big changes
- **Persistent knowledge**: `know` agent stores research in memory + markdown
- **MCP integration**: Rich tool ecosystem for research, coding, reasoning
- **Custom tools**: TypeScript extensions for project analysis

## Configuration

### Model Switching (Profiles)

We use a profile system to switch between providers (Gemini, Grok, Copilot).

```bash
npm run switch:gemini   # Primary (Gemini 3)
npm run switch:grok     # Secondary (Free Tier)
npm run switch:free     # Fallback (OpenRouter)
npm run switch:copilot  # Legacy (Copilot)
```

See [PROFILES.md](./docs/PROFILES.md) for details.

### General Configuration

Edit `opencode.json` to:
- Enable/disable MCP servers
- Adjust agent permissions
- Configure tool access

See [AGENTS.md](./AGENTS.md) for agent rules.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Complete system design
- [Agent Matrix](./docs/AGENT_MATRIX.md) - Agent selection guide
- [MCP Tools](./docs/MCP_TOOLS.md) - MCP reference
- [Quick Reference](./docs/QUICK_REFERENCE.md) - Common commands
- [System Context](./docs/SYSTEM_CONTEXT.md) - Environment info

## Requirements

- [OpenCode](https://opencode.ai) v1.0.10+
- GitHub Copilot subscription (for primary models)
- Docker (for some MCP servers)
- Optional: `fabric` CLI for AI patterns

## License

Personal configuration - feel free to use as inspiration for your own setup.

## Resources

- [OpenCode Documentation](https://opencode.ai/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Fabric AI](https://github.com/danielmiessler/fabric)
