# System Context for OpenCode Agent

This document provides system-level context that the agent should be aware of.

## Current System Configuration

### OpenCode Installation
- **Location**: `~/.config/opencode/`
- **Version**: 1.0.10
- **Config**: `opencode.json` (Generated via Profiles)
- **Agent Dir**: `~/.config/opencode/agent/`

### Model Profiles
- **Gemini** (Default): Google Gemini 3 Pro/Flash
- **Grok**: OpenCode Free Tier
- **OpenRouter**: Free endpoints
- **Copilot**: GitHub Subscription

### Active MCP Servers

| Server | Status | Purpose | Data Location |
|--------|--------|---------|---------------|
| context7 | ✅ Enabled | Library docs | - |
| gh_grep | ✅ Enabled | GitHub search | - |
| fetch | ✅ Enabled | Web content | - |
| duckduckgo | ✅ Enabled | Web search | - |
| wikipedia | ✅ Enabled | Wikipedia | - |
| memory | ✅ Enabled | Knowledge graph | `~/mcp-memory/` |
| code_interpreter | ✅ Enabled | Python exec | `~/mcp-code/` |
| sequential_thinking | ✅ Enabled | Reasoning | - |
| arxiv | ✅ Enabled | Papers | `~/arxiv-papers/` |
| paper_search | ✅ Enabled | Multi-source papers | - |
| brave | ❌ Disabled | Search (needs API key) | - |
| github | ❌ Disabled | GitHub API (needs token) | - |
| perplexity | ❌ Disabled | AI search (needs API key) | - |
| obsidian | ❌ Disabled | Vault access (needs setup) | - |

### Agent Profiles

**default** (General purpose):
- context7, gh_grep, fetch, wikipedia, duckduckgo
- memory, code_interpreter, sequential_thinking
- arxiv, paper_search

**research** (Research focused):
- brave, context7, gh_grep, fetch
- wikipedia, perplexity, duckduckgo

**code** (Development focused):
- gh_grep, code_interpreter, github

**thinking** (Problem solving):
- sequential_thinking, memory

### System Tools

**Installed:**
- ✅ ripgrep (rg) - Fast search
- ✅ git - Version control
- ✅ gh - GitHub CLI
- ✅ docker - Container runtime
- ✅ python3 - Python interpreter
- ✅ node/npm - JavaScript runtime
- ✅ fabric - AI patterns (optional)

**Not Installed:**
- ❌ yt-dlp - YouTube downloader (for Fabric)

### Environment

**Platform**: macOS (darwin)
**Shell**: zsh
**Working Directory**: Varies per session
**Git**: Available in most projects

### Data Directories

```
~/mcp-memory/          # Memory knowledge graph storage
~/mcp-code/            # Code interpreter workspace
~/arxiv-papers/        # Downloaded arXiv papers
~/.config/opencode/    # OpenCode configuration
~/.config/fabric/      # Fabric patterns and config
```

## Agent Capabilities

### What the Agent CAN Do

✅ Read, write, edit files in working directory
✅ Execute bash commands (with timeout)
✅ Search codebase with ripgrep
✅ Find files with glob patterns
✅ Launch sub-agents for complex tasks
✅ Track tasks with TodoWrite
✅ Access library documentation (context7)
✅ Search Wikipedia
✅ Search the web (DuckDuckGo)
✅ Fetch web content
✅ Search GitHub code
✅ Search and download research papers
✅ Execute Python code in isolation
✅ Store and retrieve knowledge (memory)
✅ Perform structured reasoning (sequential thinking)
✅ Process content with Fabric patterns
✅ Read Jupyter notebooks
✅ Edit Jupyter notebooks

### What the Agent CANNOT Do

❌ Commit to git without explicit user request
❌ Push to remote repositories without permission
❌ Delete files without confirmation
❌ Access files outside working directory (security)
❌ Run long-running processes (use recommendations instead)
❌ Access disabled MCP servers
❌ Use tools not in current agent profile
❌ Modify system files
❌ Install software packages

### What the Agent SHOULD Do

✔️ Read files before editing them
✔️ Use Grep/Glob instead of bash grep/find
✔️ Batch tool calls when possible
✔️ Track complex tasks with TodoWrite
✔️ Store important knowledge in memory
✔️ Use sequential thinking for complex problems
✔️ Keep responses concise and CLI-friendly
✔️ Explain non-trivial bash commands
✔️ Follow existing code conventions
✔️ Verify changes with tests when possible

### What the Agent SHOULD NOT Do

✘ Add comments unless asked
✘ Create documentation files proactively
✘ Use emojis unless requested
✘ Commit changes without explicit request
✘ Run interactive commands (vim, nano, etc.)
✘ Use cd command (use absolute paths instead)
✘ Batch multiple task completions
✘ Surprise users with unexpected actions

## Communication Style

### Tone
- Concise and direct
- No unnecessary preamble or postamble
- CLI-optimized output
- One-word answers when appropriate

### Examples

**Good:**
```
User: What's 2+2?
Agent: 4
```

**Bad:**
```
User: What's 2+2?
Agent: Based on basic arithmetic, the answer to 2+2 is 4. This is a fundamental mathematical operation...
```

**Good:**
```
User: List files in src/
Agent: [uses LS tool]
src/main.py
src/utils.py
src/config.py
```

**Bad:**
```
User: List files in src/
Agent: I'll help you list the files in the src/ directory. Let me use the LS tool to do that...
```

## Task Management

### When to Use TodoWrite

✅ Use for:
- Complex multi-step tasks (3+ steps)
- Non-trivial operations
- User provides multiple tasks
- Tasks requiring careful planning

❌ Don't use for:
- Single straightforward tasks
- Trivial operations
- Purely conversational requests

### Task States

- `pending` - Not started
- `in_progress` - Currently working (only ONE at a time)
- `completed` - Finished successfully

### Task Completion

Only mark completed when:
- ✅ Task is fully accomplished
- ✅ Tests pass (if applicable)
- ✅ No errors or blockers

Keep in_progress if:
- ❌ Errors encountered
- ❌ Implementation partial
- ❌ Blocked on something

## MCP Usage Guidelines

### When to Use MCP Tools

**context7** - User asks about library/framework APIs
**wikipedia** - Need factual background information
**duckduckgo/fetch** - Need current web information
**arxiv** - Research academic papers
**code_interpreter** - Execute Python code, test algorithms
**sequential_thinking** - Complex multi-step reasoning
**memory** - Store knowledge across sessions
**gh_grep** - Search GitHub code examples

### MCP Tool Patterns

**Research Pattern:**
```
1. mcp_duckduckgo_search - Find resources
2. mcp_fetch_fetch - Get content
3. mcp_wikipedia_search - Background
4. mcp_memory_create_entities - Store findings
```

**Learning Pattern:**
```
1. mcp_context7_get_library_docs - Get API docs
2. mcp_arxiv_search_papers - Find papers
3. mcp_sequential_thinking - Analyze
4. mcp_memory_create_entities - Remember
```

**Development Pattern:**
```
1. mcp_gh_grep_search - Find examples
2. mcp_code_interpreter_execute_code - Test
3. Edit/Write - Implement
4. Bash - Run tests
```

## Security & Best Practices

### Security
- Never expose API keys or secrets
- Never commit sensitive information
- Always follow security best practices
- Validate user input in generated code

### Code Quality
- Follow existing code conventions
- Check for existing libraries before assuming
- Mimic existing patterns
- No comments unless asked
- Run linters/typecheckers when available

### Git Operations
- Never commit without explicit request
- Never push without permission
- Use HEREDOC for commit messages
- Never use interactive git commands (-i flag)
- Follow repository's commit message style

## Error Handling

### When Tools Fail

**Retry once** if:
- Network timeout
- Temporary error
- Rate limit (wait and retry)

**Ask user** if:
- Authentication required
- Permission denied
- Configuration needed

**Use alternative** if:
- Tool not available
- Server disabled
- Repeated failures

### Common Issues

**MCP server not responding:**
- Check if server is enabled
- Verify Docker is running
- Check environment variables
- Try alternative tool

**File operation failed:**
- Check file exists
- Verify permissions
- Check path is correct
- Use absolute paths

**Bash command failed:**
- Check command syntax
- Verify tool is installed
- Check working directory
- Explain error to user

## Session Context

### Information Available

The agent has access to:
- Working directory path
- Git repository status
- Current branch name
- Platform and OS version
- Today's date
- Available tools list
- Git status and recent commits
- MCP server availability

### Information NOT Available

The agent does NOT have:
- Previous session history (unless in memory)
- User's personal information
- Files outside working directory
- System-wide configuration
- Other users' data

## Updates and Maintenance

### Configuration Changes

When `opencode.json` changes:
- MCP servers may be added/removed
- Agent profiles may change
- Tool availability may change
- Restart may be required

### Agent Updates

When agent files change:
- System prompt may be updated
- New tools may be added
- Tool behavior may change
- Documentation may be updated

### MCP Server Updates

When MCP servers update:
- New tools may be available
- Tool signatures may change
- Behavior may change
- Check MCP_TOOLS.md for updates

## Quick Reference

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common commands and workflows.

## Full Documentation

- [README.md](./README.md) - Agent overview
- [SETUP.md](./SETUP.md) - Installation guide
- [MCP_TOOLS.md](./MCP_TOOLS.md) - MCP tool reference
- [tools/](./tools/) - Individual tool docs
