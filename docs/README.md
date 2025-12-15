# OpenCode Agent

**Description**: Open-source CLI agent for OpenCode - adapted from Claude Code  
**Type**: CLI Tool  
**Environment**: Multi-model support (open source & proprietary models)  
**License**: Open Source

## Overview

OpenCode Agent is an open-source command-line interface agent adapted from Anthropic's Claude Code. It provides an interactive CLI environment with sophisticated tools for code manipulation, file management, search operations, and task planning.

### Key Features

- **Model Agnostic** - Works with any LLM (Ollama, OpenAI, Anthropic, local models)
- **Comprehensive Toolset** - 16 specialized tools for software engineering
- **MCP Integration** - 14 MCP servers with 50+ additional tools
- **Fabric Integration** - Access to 100+ AI patterns for content processing
- **Task Management** - Built-in todo tracking for complex workflows
- **Knowledge Persistence** - Memory graph for cross-session context
- **Concise Communication** - CLI-optimized, minimal output style

## Quick Start

```bash
# Install dependencies
brew install ripgrep  # macOS
pip install fabric-ai

# Setup Fabric (optional but recommended)
fabric --setup
fabric --update

# Run the agent (example)
opencode "Create a FastAPI project with authentication"
```

See [SETUP.md](./SETUP.md) for detailed installation and configuration.

## Built-in Tools (16)

| Tool | Description | Use Case |
|------|-------------|----------|
| **Bash** | Execute shell commands with timeout | Run tests, build, git operations |
| **Read** | Read files (text, images, PDFs) | Understand code, analyze content |
| **Write** | Write new files | Create new code files |
| **Edit** | String replacement in files | Modify existing code |
| **MultiEdit** | Multiple edits in one operation | Refactor multiple sections |
| **Grep** | Search with ripgrep | Find code patterns, search codebase |
| **Glob** | File pattern matching | Find files by name/extension |
| **LS** | List directories | Explore project structure |
| **Task** | Launch sub-agents | Delegate complex searches |
| **TodoWrite** | Task management | Track multi-step workflows |
| **NotebookRead** | Read Jupyter notebooks | Analyze data science code |
| **NotebookEdit** | Edit Jupyter notebooks | Modify notebook cells |
| **WebFetch** | Fetch web content | Research documentation |
| **WebSearch** | Search the web | Find current information |
| **Fabric** | AI pattern processing | Extract wisdom, generate code |
| **ExitPlanMode** | Exit planning mode | Transition from planning to coding |

## MCP Tools (50+)

The agent has access to 14 MCP servers providing 50+ additional tools:

| Server | Tools | Purpose |
|--------|-------|---------|
| **context7** | 2 tools | Library documentation (React, Next.js, FastAPI, etc.) |
| **wikipedia** | 10 tools | Wikipedia search, articles, summaries, facts |
| **duckduckgo** | 2 tools | Web search and content fetching |
| **fetch** | 1 tool | Fetch and parse web content as markdown |
| **gh_grep** | 1 tool | Search code across GitHub repositories |
| **arxiv** | 4 tools | Search, download, read research papers |
| **paper_search** | 15 tools | Multi-source academic paper search |
| **code_interpreter** | 1 tool | Execute Python code in isolated environment |
| **sequential_thinking** | 1 tool | Chain-of-thought structured reasoning |
| **memory** | 9 tools | Persistent knowledge graph storage |
| **github** | 10+ tools | GitHub API (issues, PRs, repos) |
| **obsidian** | 10 tools | Obsidian vault access |
| **perplexity** | 1 tool | Perplexity AI search |
| **brave** | 1 tool | Brave search API |

See [MCP_TOOLS.md](./MCP_TOOLS.md) for complete documentation.

## Architecture

```
agent/
├── README.md              # This file
├── SETUP.md              # Installation & configuration
├── system-prompt.md      # Main system prompt
├── system-prompt.j2      # Jinja2 template version
└── tools/                # Tool definitions (16 tools)
    ├── Bash.md
    ├── Edit.md
    ├── Fabric.md         # NEW: Fabric integration
    ├── Glob.md
    ├── Grep.md
    ├── LS.md
    ├── MultiEdit.md
    ├── NotebookEdit.md
    ├── NotebookRead.md
    ├── Read.md
    ├── Task.md
    ├── TodoWrite.md
    ├── WebFetch.md
    ├── WebSearch.md
    ├── Write.md
    └── exit-plan-mode.md
```

## Usage Examples

### Code Generation
```bash
opencode "Create a REST API for user management with FastAPI"
```

### Code Analysis
```bash
opencode "Analyze the authentication flow in src/auth.py"
```

### Refactoring
```bash
opencode "Refactor the database connection to use connection pooling"
```

### Content Processing (Fabric)
```bash
# Extract wisdom from a video
yt https://youtube.com/watch?v=abc | fabric --pattern extract_wisdom

# Generate project from description
echo "Build a CLI tool for file management" | fabric --pattern create_coding_project
```

### Multi-step Tasks
```bash
opencode "Add dark mode support: update CSS, add toggle component, persist preference"
```

## Agent Behavior

### Communication Style
- **Concise** - Minimal output, no unnecessary explanations
- **Direct** - Answer questions without preamble
- **Action-oriented** - Do tasks, don't just describe them
- **CLI-friendly** - Formatted for terminal display

### Task Management
- Uses TodoWrite for complex multi-step tasks
- Marks tasks in_progress before starting
- Marks completed immediately after finishing
- Only one task in_progress at a time

### Code Conventions
- Reads existing code to understand style
- Mimics existing patterns and libraries
- Never adds comments unless asked
- Follows security best practices
- Never commits without explicit request

## Integration

### With OpenCode CLI
```python
from opencode.agent import Agent

agent = Agent(
    model="llama3.1:70b",
    working_dir="/path/to/project"
)

response = agent.run("Add error handling to main.py")
```

### With MCP
```json
{
  "mcpServers": {
    "opencode-agent": {
      "command": "python",
      "args": ["-m", "opencode.agent"],
      "env": {
        "WORKING_DIRECTORY": "${workspaceFolder}"
      }
    }
  }
}
```

### With Fabric
```bash
# Use Fabric patterns within agent workflows
opencode "Extract key insights from docs/architecture.md using Fabric"
```

## Model Support

Works with any OpenAI-compatible API:

- **Local**: Ollama, LM Studio, LocalAI
- **Cloud**: OpenAI, Anthropic, OpenRouter
- **Open Source**: Llama, Mistral, Qwen, DeepSeek
- **Proprietary**: GPT-4, Claude, Gemini

## Adaptation from Claude Code

This agent is adapted from Anthropic's Claude Code with these changes:

✅ **Added:**
- Fabric tool integration
- Model-agnostic design
- Open-source compatibility
- Enhanced documentation

✅ **Removed:**
- Claude-specific references
- Proprietary service dependencies
- Anthropic-specific URLs

✅ **Adapted:**
- System prompts for any model
- Tool descriptions for open-source use
- Configuration for flexible backends

## Contributing

To add new tools:

1. Create `agent/tools/YourTool.md`
2. Follow the YAML frontmatter format
3. Document usage and examples
4. Update this README
5. Test with multiple models

## Documentation

- 📋 [Complete Index](./INDEX.md) - **Start here** - Full documentation index
- 📖 [Setup Guide](./SETUP.md) - Installation and configuration
- ⚡ [Quick Reference](./QUICK_REFERENCE.md) - Common commands and workflows
- 🔧 [MCP Tools Reference](./MCP_TOOLS.md) - Complete MCP tool documentation
- 🖥️ [System Context](./SYSTEM_CONTEXT.md) - System configuration and capabilities
- 📁 [Tool Documentation](./tools/) - Individual tool references
- 🎨 [Fabric Patterns](https://github.com/danielmiessler/fabric) - AI pattern framework
- 🔗 [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol

## License

Open Source - Adapted from Claude Code for the community

## Support

- 📖 Read [SETUP.md](./SETUP.md) for configuration help
- 🔧 Check tool docs in `agent/tools/` for usage
- 🐛 Report issues on GitHub
- 💬 Join discussions for questions
