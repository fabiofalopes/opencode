# OpenCode Agent Rules

This file contains project-specific instructions for OpenCode agents.

## Project Context

This is the OpenCode configuration directory at `~/.config/opencode/`. It contains:
- Agent definitions and system prompts
- MCP server configurations
- Custom tools and utilities
- Documentation and setup guides

## Agent Configuration Schema

Agent files in `.opencode/agent/` use YAML frontmatter. **CRITICAL**: Follow the correct format to avoid runtime errors.

### Quick Reference

| Field | Type | Required |
|-------|------|----------|
| `description` | string | ✅ Yes |
| `mode` | `"primary"` \| `"subagent"` \| `"all"` | No |
| `temperature` | number (0-1) | No |
| `tools` | `Record<string, boolean>` | No |
| `permission` | object | No |

### ⚠️ Critical Rule: tools Field

```yaml
# ✅ CORRECT (key-value pairs)
tools:
  write: true
  edit: false
  bash: true

# ❌ WRONG (array - causes "expected record, received array" error)
tools:
  - write
  - edit
```

### Validation

Run before deploying agent changes:
```bash
npm run validate:agents
```

### Full Schema Documentation

See: `@docs/AGENT_MD_SCHEMA.md`

## Code Standards

- Use TypeScript for custom tools
- Follow existing code conventions
- Keep responses concise and CLI-friendly
- Always read files before editing

## Model Configuration

**CRITICAL RULE**: Use the Profile System. Do NOT edit `opencode.json` manually.

### 🚨 APPROVED PROVIDERS ONLY

**FORBIDDEN:** OpenRouter is completely banned. Never use OpenRouter models.

**APPROVED PROVIDERS (in priority order):**

1. **OpenCode Zens** - Primary (FREE, unlimited during promo)
2. **Google** - Secondary (FREE with native Gemini models)
3. **GitHub Copilot** - Tertiary (Paid subscription)
4. **OpenCode Grok** - Fallback (FREE, single model)

### 🎯 How to Switch Models

We use a **Profile System** to manage model configurations. This allows instant switching between providers without editing files.

**Commands:**

| Command | Profile | Description |
|---------|---------|-------------|
| `npm run switch:zens` | **OpenCode Zens** | **PRIMARY.** Minimax M2.1 & GLM-4.7. Free, unlimited. Best code generation. |
| `npm run switch:gemini` | **Gemini 3** | **SECONDARY.** Google's Gemini 3 Pro/Flash. Free. Multimodal & thinking. |
| `npm run switch:copilot` | **Copilot** | **TERTIARY.** GitHub Copilot subscription. Diversified models (GPT, Claude). |
| `npm run switch:grok` | **Grok** | **FALLBACK.** OpenCode Grok. Free tier, single model. |

### ⚙️ Customizing Profiles

To change which models are used in a profile:
1. Edit `profiles.json`.
2. Run the switch command again (e.g., `npm run switch:zens`) to apply changes.

**Do NOT edit `opencode.json` directly for model changes.** It will be overwritten by the profile system.

### 📋 Model Details

**OpenCode Zens (Primary - FREE):**
- `minimax-m2.1` - Code generation, agentic workflows, strong reasoning
- `glm-4.7` - Multi-step reasoning, multilingual coding
- **Setup:** Requires `/connect` in OpenCode TUI (see `@docs/OPENCODE_ZENS_SETUP.md`)

**Google Gemini (Secondary - FREE):**
- `gemini-3-pro` - High intelligence, multimodal
- `gemini-3-flash` - Fast, efficient
- `gemini-3-pro-high` - High thinking capability
- `gemini-2.5-flash` - Lightweight, fast
- **Note:** Only use native Gemini models. Google-hosted Claude has auth issues.

**GitHub Copilot (Tertiary - PAID):**
- `gpt-5.1-codex` - Code-specialized, best for implementation
- `claude-haiku-4.5` - Fast, cheap, good for planning
- `claude-sonnet-4.5` - Balanced, for complex tasks
- `claude-opus-4.5` - Research-heavy tasks only (expensive)

**OpenCode Grok (Fallback - FREE):**
- `grok-codefast-2` - Single model for all tasks, fast, free

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

## Context Management (Multi-Session Work)

Agents are constrained by context like humans are constrained by time. This requires deliberate management.

### Core Principle

> **"Agents manage context like humans manage time."**

Context is finite. What's not written to files is lost when the session ends. Complex work must be planned for multi-session execution.

### When to Use Multi-Session Protocol

- Task has 5+ deliverables
- Involves research + implementation + testing
- User mentions "project", "system", "architecture"
- Would consume >50% of context window

### Multi-Session Protocol

1. **PLAN**: Create `docs/plans/PROJECT_MASTERPLAN.md`
2. **SKILL**: Create `skills/project-resume.md`  
3. **EXECUTE**: Work on tasks, update progress checkboxes
4. **HANDOFF**: Before session ends, ensure state is saved
5. **RESUME**: Next session loads skill, continues work

### Critical Rule: Externalize Immediately

**TodoWrite is ephemeral. Files are permanent.**

- ❌ BAD: Adding pending tasks only to TodoWrite (lost when session ends)
- ✅ GOOD: Write pending tasks to masterplan/plan files immediately

When user mentions future work or pending tasks:
1. Add to TodoWrite for current session tracking
2. **IMMEDIATELY** write to the relevant plan file (e.g., `docs/plans/*.md`)
3. Confirm to user that it's persisted to disk

### Key Rules

- **Externalize early**: Write to files, don't hold in context
- **Update continuously**: Plans are living documents
- **Check off progress**: Mark completed items immediately
- **Prepare for continuation**: Every session should be resumable

### Load the Full Framework

For detailed guidance:
```
Load skill: multi-session-work
```

See also: `skills/multi-session-work.md`

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

## Session Monitoring with OCMonitor

**ocmonitor** is a CLI tool for monitoring OpenCode sessions - tracking token usage, costs, and analytics.

### Quick Commands

```bash
# Session overview
ocmonitor sessions              # All sessions summary
ocmonitor sessions -l 5         # Last 5 sessions
ocmonitor live                  # Real-time dashboard

# Reports
ocmonitor daily --breakdown     # Daily usage by model
ocmonitor weekly --breakdown    # Weekly with model breakdown
ocmonitor projects              # Project-level costs
ocmonitor models                # Model usage statistics

# Export
ocmonitor export sessions -f csv -o report.csv
```

### Key Paths

```
~/.local/share/opencode/storage/message/   # Session data
~/.config/ocmonitor/config.toml            # OCMonitor config
~/projetos/hub/ocmonitor-share/            # Source code
```

### When to Use

- **User asks about costs**: `ocmonitor models` or `ocmonitor projects`
- **Need current session info**: `ocmonitor sessions -l 1`
- **Track a project**: `ocmonitor projects --timeframe weekly`
- **Generate reports**: `ocmonitor export <type> -f csv`

### Full Reference

See `@docs/OCMONITOR_REFERENCE.md` for complete documentation.
See `@skills/ocmonitor.md` for agent skill reference.

## External File References

When you encounter file references in this format, read them on a need-to-know basis:

- MCP usage: @docs/MCP_TOOLS.md
- System context: @docs/SYSTEM_CONTEXT.md
- Quick reference: @docs/QUICK_REFERENCE.md
- Tool documentation: @docs/tools/
- OCMonitor reference: @docs/OCMONITOR_REFERENCE.md
- Skills: @skills/

## Project-Specific Conventions

- Agent definitions are in `.opencode/agent/` directory
- MCP configurations are in `opencode.json`
- Custom tools go in `.opencode/tool/`
- Documentation is in `docs/` directory
- Skills are in `skills/` directory
- All paths relative to `~/.config/opencode/`
