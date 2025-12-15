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

**SIMPLE RULE**: Edit `opencode.json` directly. No scripts needed.

### 🎯 Where to Edit Models

Open `opencode.json` and find these lines:

| Agent | Line | Current Model |
|-------|------|---------------|
| **Global** | Line 8 | `"model": "github-copilot/claude-sonnet-4.5"` |
| **build** | Line 244 | `"model": "github-copilot/claude-sonnet-4.5"` |
| **plan** | Line 268 | `"model": "github-copilot/claude-haiku-4.5"` |
| **code** | Line 294 | `"model": "github-copilot/gpt-5.1-codex"` |
| **research** | Line 318 | `"model": "github-copilot/claude-opus-4.5"` |
| **thinking** | Line 346 | `"model": "github-copilot/claude-sonnet-4.5"` |

### 🔄 Two Configurations

**PRIMARY (GitHub Copilot - Uses Your Subscription):**
```json
"model": "github-copilot/claude-sonnet-4.5"    // Global + build + thinking
"model": "github-copilot/claude-haiku-4.5"     // plan
"model": "github-copilot/gpt-5.1-codex"        // code
"model": "github-copilot/claude-opus-4.5"      // research
```

**FALLBACK (OpenCode Free - When GitHub Access Lost):**
```json
"model": "opencode/grok-codefast-2"            // All agents (single model)
```

### 💡 How to Switch

**Option 1 - Manual (Recommended for selective changes):**
1. Open `opencode.json`
2. Go to lines 8, 244, 268, 294, 318, 346
3. Change model strings directly
4. Save

**Option 2 - Find & Replace (For full switch to fallback):**
1. Open `opencode.json` 
2. Find: `"github-copilot/claude-sonnet-4.5"`
3. Replace with: `"opencode/grok-codefast-2"`
4. Find: `"github-copilot/claude-haiku-4.5"`
5. Replace with: `"opencode/grok-codefast-2"`
6. Find: `"github-copilot/gpt-5.1-codex"`
7. Replace with: `"opencode/grok-codefast-2"`
8. Find: `"github-copilot/claude-opus-4.5"`
9. Replace with: `"opencode/grok-codefast-2"`
10. Save

**That's it. No scripts. No complexity.**

### 📋 Model Details

**GitHub Copilot Models (Primary):**
- `claude-sonnet-4.5` - Balanced, general purpose
- `claude-haiku-4.5` - Fast, efficient for planning
- `gpt-5.1-codex` - Code-specialized
- `claude-opus-4.5` - Most powerful, research

**OpenCode Models (Fallback):**
- `grok-codefast-2` - Free tier, single model for all tasks

## MCP Server Usage

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
