# OpenCode Agent Rules

This file contains project-specific instructions for OpenCode agents.

## Project Context

This is the OpenCode configuration directory at `~/.config/opencode/`. It contains:
- Agent definitions and system prompts
- MCP server configurations
- Custom tools and utilities
- Documentation and setup guides

## Code Standards

- Use TypeScript for custom tools
- Follow existing code conventions
- Keep responses concise and CLI-friendly
- Always read files before editing

## Model Configuration

**SIMPLE RULE**: Use the Profile System. Do NOT edit `opencode.json` manually.

### 🎯 How to Switch Models

We use a **Profile System** to manage model configurations. This allows instant switching between providers (e.g., Copilot vs. Gemini vs. Free Tier) without editing files.

**Commands:**

| Command | Profile | Description |
|---------|---------|-------------|
| `npm run switch:gemini` | **Gemini 3** | **Primary.** Google's Gemini 3 Pro/Flash. Best for multimodal & thinking. |
| `npm run switch:grok` | **Grok** | **Secondary.** OpenCode's free tier. Fast but has limits. |
| `npm run switch:free` | **OpenRouter** | **Fallback.** Free endpoints (Gemini 2.0 Flash Exp). |
| `npm run switch:copilot` | **Copilot** | **Legacy.** GitHub Copilot subscription models. |

### ⚙️ Customizing Profiles

To change which models are used in a profile:
1. Edit `profiles.json`.
2. Run the switch command again (e.g., `npm run switch:gemini`) to apply changes.

**Do NOT edit `opencode.json` directly for model changes.** It will be overwritten by the profile system.

### 📋 Model Details

**Gemini 3 (Primary):**
- `gemini-3-pro` - High intelligence, multimodal
- `gemini-3-flash` - Fast, efficient
- `gemini-3-pro-high` - High thinking capability

**OpenCode Models (Secondary):**
- `grok-codefast-2` - Free tier, single model for all tasks

**GitHub Copilot Models (Legacy):**
- `claude-sonnet-4.5` - Balanced
- `claude-haiku-4.5` - Fast
- `gpt-5.1-codex` - Code-specialized
- `claude-opus-4.5` - Research

## MCP Server Usage

### Advanced Management
We now use a modular configuration system. See `@docs/MCP_ADVANCED_ARCHITECTURE.md` for details on managing servers via `scripts/manage-mcp.ts`.

### When to Use MCP Tools

**context7** - When user asks about library/framework documentation
```txt
use context7 to get Next.js routing documentation
```

**wikipedia** - For factual background information
```txt
use wikipedia to research machine learning concepts
```

**duckduckgo** - For current web information
```txt
use duckduckgo to find recent FastAPI tutorials
```

**arxiv** - For academic research papers
```txt
use arxiv to find papers on transformer architecture
```

**code_interpreter** - To execute Python code
```txt
use code_interpreter to test this algorithm
```

**sequential_thinking** - For complex multi-step reasoning
```txt
use sequential_thinking to break down this problem
```

**memory** - To store knowledge across sessions
```txt
use memory to remember this project structure
```

**gh_grep** - To search GitHub code examples
```txt
If you are unsure how to do something, use gh_grep to search code examples from GitHub
```

**hackernews** - For tech news and Hacker News discussions
```txt
use hackernews to get top tech stories
use hackernews to search for AI discussions
```

### MCP Best Practices

1. **Always specify which MCP to use** when the task requires external data
2. **Combine MCPs** for comprehensive research (e.g., context7 + gh_grep + arxiv)
3. **Store findings in memory** for future reference
4. **Use sequential_thinking** for complex analysis

## Task Management

- Use TodoWrite for complex multi-step tasks (3+ steps)
- Mark tasks in_progress before starting
- Mark completed immediately after finishing
- Only one task in_progress at a time

## File Operations

- Always use Read before Edit
- Use Grep/Glob instead of bash grep/find
- Use absolute paths, avoid cd command
- Batch tool calls when possible

## Git Operations

- Never commit without explicit user request
- Never push without permission
- Use HEREDOC for commit messages
- Follow repository's commit message style

## Communication Style

- Concise and direct responses
- No unnecessary preamble or postamble
- CLI-optimized output
- One-word answers when appropriate

## Security

- Never expose API keys or secrets
- Never commit sensitive information
- Always follow security best practices
- Validate user input in generated code

## Agent-Specific Instructions

### Build Agent
- Full development work with all tools enabled
- Run tests after code changes
- Verify with linters/typecheckers when available

### Plan Agent
- Analysis and planning without making changes
- Use sequential_thinking for complex planning
- Store plans in memory for future reference

### Research Agent
- Use context7, wikipedia, duckduckgo, arxiv
- Store findings in memory
- Provide comprehensive summaries

### Code Agent
- Focus on code quality and best practices
- Use gh_grep for examples
- Use code_interpreter for testing
- Run tests and linters

## External File References

When you encounter file references in this format, read them on a need-to-know basis:

- MCP usage: @docs/MCP_TOOLS.md
- System context: @docs/SYSTEM_CONTEXT.md
- Quick reference: @docs/QUICK_REFERENCE.md
- Tool documentation: @docs/tools/

## Project-Specific Conventions

- Agent definitions are in `.opencode/agent/` directory
- MCP configurations are in `opencode.json`
- Custom tools go in `.opencode/tool/`
- Documentation is in `docs/` directory
- All paths relative to `~/.config/opencode/`
