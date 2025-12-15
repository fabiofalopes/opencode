# OpenCode Complete Setup Guide

This guide covers the complete OpenCode setup in `~/.config/opencode/`.

## Directory Structure

```
~/.config/opencode/
├── opencode.json           # Main configuration
├── AGENTS.md              # Project rules and instructions
├── OPENCODE_SETUP.md      # This file
├── MCP_SERVERS.md         # MCP server reference
├── .opencode/             # OpenCode-specific files
│   ├── agent/             # Agent definitions (markdown)
│   │   ├── build.md       # Primary: Full development
│   │   ├── plan.md        # Primary: Planning/analysis
│   │   ├── code.md        # Subagent: Code development
│   │   ├── research.md    # Subagent: Research
│   │   └── thinking.md    # Subagent: Problem solving
│   └── tool/              # Custom tools (TypeScript)
│       ├── git-info.ts    # Git status and diff tools
│       ├── analyze.ts     # Code analysis tool
│       ├── project-info.ts # Project structure tools
│       └── fabric.ts      # Fabric AI integration
└── agent/                 # Legacy agent docs (reference)
    ├── README.md
    ├── SETUP.md
    ├── MCP_TOOLS.md
    ├── SYSTEM_CONTEXT.md
    ├── QUICK_REFERENCE.md
    ├── INDEX.md
    ├── system-prompt.md
    ├── system-prompt.j2
    └── tools/             # Tool documentation
```

## Configuration Files

### opencode.json

Main configuration with:
- **instructions**: Files to include in context (AGENTS.md, SYSTEM_CONTEXT.md, MCP_TOOLS.md)
- **provider**: LLM provider configuration
- **mcp**: MCP server definitions
- **tools**: Global tool enable/disable
- **permission**: Global permissions
- **agent**: Agent-specific configurations
- **formatter**: Code formatter settings

### AGENTS.md

Project-specific rules that get loaded into every session:
- MCP usage guidelines
- Task management rules
- File operation best practices
- Git operation rules
- Communication style
- Security guidelines

## Agents

### Primary Agents (Tab to switch)

**build** - Full development agent
- All tools enabled
- Can read, write, edit files
- Can execute bash commands
- Has access to all MCP tools
- Temperature: 0.3

**plan** - Planning and analysis
- Read-only access
- Cannot modify files or run commands
- Has access to research MCP tools
- Temperature: 0.1

### Subagents (@ mention to invoke)

**@code** - Code development
- Focus on code quality
- GitHub integration
- Code interpreter for testing
- Bash commands require approval for git operations

**@research** - Information gathering
- All research MCP tools
- Cannot modify files
- Synthesizes information from multiple sources

**@thinking** - Problem solving
- Sequential thinking for structured reasoning
- Memory for knowledge storage
- Read-only access

## MCP Servers

### Enabled by Default

| Server | Purpose | Tools |
|--------|---------|-------|
| context7 | Library docs | 2 tools |
| gh_grep | GitHub search | 1 tool |
| fetch | Web content | 1 tool |
| duckduckgo | Web search | 2 tools |
| wikipedia | Wikipedia | 10 tools |
| memory | Knowledge graph | 9 tools |
| code_interpreter | Python execution | 1 tool |
| sequential_thinking | Reasoning | 1 tool |
| arxiv | Research papers | 4 tools |
| paper_search | Multi-source papers | 15 tools |
| hackernews | Hacker News | 4 tools |

### Disabled (Require API Keys)

- brave - Brave search API
- github - GitHub API (needs GITHUB_PERSONAL_ACCESS_TOKEN)
- perplexity - Perplexity AI (needs PERPLEXITY_API_KEY)
- obsidian - Obsidian vault (needs setup)

## Custom Tools

### git-info

**git_info_status** - Detailed git status
```txt
use git_info_status to see current branch and changes
```

**git_info_diff** - Git diff
```txt
use git_info_diff with staged=true to see staged changes
```

### analyze

**analyze** - Code file analysis
```txt
use analyze on src/main.ts to get metrics
```

### project-info

**project_info_structure** - Project structure
```txt
use project_info_structure to understand the project
```

**project_info_dependencies** - List dependencies
```txt
use project_info_dependencies to see all packages
```

### fabric

**fabric** - Fabric AI patterns
```txt
use fabric with pattern=extract_wisdom and input="<content>"
```

## Usage Examples

### Switch Agents

```bash
# Press Tab to cycle through primary agents (build, plan)
# Or use configured keybind
```

### Invoke Subagents

```txt
@code help me implement authentication
@research find FastAPI best practices
@thinking break down this complex problem
```

### Use MCP Tools

```txt
use context7 to get Next.js routing docs
use gh_grep to find FastAPI auth examples
use arxiv to search for transformer papers
use code_interpreter to test this algorithm
use sequential_thinking to analyze this problem
use memory to store this project structure
```

### Use Custom Tools

```txt
use git_info_status to see current changes
use analyze on src/main.ts
use project_info_structure
use fabric with pattern=summarize
```

## Best Practices

### Agent Selection

- **build** - When you need to make changes
- **plan** - When you want analysis without changes
- **@code** - For focused code development
- **@research** - For gathering information
- **@thinking** - For complex problem solving

### MCP Usage

1. **Specify which MCP to use** in your prompts
2. **Combine MCPs** for comprehensive results
3. **Store findings in memory** for future reference
4. **Use sequential_thinking** for complex analysis

### Task Management

- Use TodoWrite for multi-step tasks (3+ steps)
- Mark in_progress before starting
- Mark completed immediately after finishing
- Only one task in_progress at a time

### File Operations

- Always Read before Edit
- Use Grep/Glob instead of bash grep/find
- Use absolute paths, avoid cd
- Batch tool calls when possible

## Permissions

### Global Defaults

- edit: allow
- bash: allow
- webfetch: allow

### Agent-Specific

**plan agent:**
- edit: deny
- bash: deny
- webfetch: allow

**code agent:**
- edit: allow
- bash: git commands ask, others ask
- webfetch: deny

**research/thinking agents:**
- edit: deny
- bash: deny
- webfetch: allow (research only)

## Formatters

Auto-formatting enabled for:
- **prettier** - JS/TS/JSON/MD/etc
- **biome** - Alternative to prettier

Formatters run automatically after file writes/edits.

## Environment Variables

Set these for optional features:

```bash
# GitHub integration
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...

# Brave search
export BRAVE_API_KEY=...

# Perplexity AI
export PERPLEXITY_API_KEY=...

# Obsidian
export OBSIDIAN_HOST=host.docker.internal
export OBSIDIAN_API_KEY=...
```

## Troubleshooting

### MCP Server Not Responding

1. Check Docker is running
2. Verify server is enabled in opencode.json
3. Check environment variables
4. Increase timeout value

### Tool Not Available

1. Check agent profile configuration
2. Verify tool is enabled globally or per-agent
3. Check permissions

### Custom Tool Not Working

1. Ensure TypeScript file is in `.opencode/tool/`
2. Check tool syntax and exports
3. Restart OpenCode

## Next Steps

1. **Test agents**: Try switching between build and plan
2. **Test MCP tools**: Use context7, gh_grep, wikipedia
3. **Test custom tools**: Try git_info_status, analyze
4. **Create custom tools**: Add your own in `.opencode/tool/`
5. **Customize agents**: Edit `.opencode/agent/*.md` files
6. **Update rules**: Modify AGENTS.md for project-specific needs

## Resources

- [OpenCode Docs](https://opencode.ai/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Agent Documentation](./agent/README.md)
- [MCP Tools Reference](./agent/MCP_TOOLS.md)
- [System Context](./agent/SYSTEM_CONTEXT.md)
