# OpenCode Agent Setup Guide

## Overview

OpenCode Agent is an open-source CLI agent adapted from Claude Code, designed to work with any open-source LLM model. It provides a comprehensive set of tools for software engineering tasks.

## Directory Structure

```
agent/
├── README.md              # Agent overview and documentation
├── SETUP.md              # This file - setup instructions
├── system-prompt.md      # Main system prompt (variable format)
├── system-prompt.j2      # Jinja2 template version
└── tools/                # Tool definitions
    ├── Bash.md           # Execute bash commands
    ├── Edit.md           # Edit files with string replacement
    ├── MultiEdit.md      # Multiple edits in one operation
    ├── Write.md          # Write files
    ├── Read.md           # Read files (text, images, PDFs)
    ├── LS.md             # List directories
    ├── Glob.md           # File pattern matching
    ├── Grep.md           # Search with ripgrep
    ├── Task.md           # Launch sub-agents
    ├── TodoWrite.md      # Task management
    ├── NotebookRead.md   # Read Jupyter notebooks
    ├── NotebookEdit.md   # Edit Jupyter notebooks
    ├── WebFetch.md       # Fetch web content
    ├── WebSearch.md      # Search the web
    ├── Fabric.md         # Fabric AI patterns
    └── exit-plan-mode.md # Exit planning mode
```

## Prerequisites

### Required Tools

1. **ripgrep** - Fast search tool
   ```bash
   # macOS
   brew install ripgrep
   
   # Linux
   apt install ripgrep  # Debian/Ubuntu
   dnf install ripgrep  # Fedora
   ```

2. **Python 3.8+** - For various tools
   ```bash
   python3 --version
   ```

3. **Git** - Version control
   ```bash
   git --version
   ```

### Optional Tools

1. **Fabric** - AI pattern framework
   ```bash
   pip install fabric-ai
   # or
   pipx install fabric-ai
   
   # Setup
   fabric --setup
   fabric --update
   ```

2. **GitHub CLI** - For PR/issue management
   ```bash
   # macOS
   brew install gh
   
   # Linux
   # See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
   ```

3. **yt-dlp** - For YouTube content (used with Fabric)
   ```bash
   pip install yt-dlp
   # or
   brew install yt-dlp
   ```

## Configuration

### Environment Variables

The agent uses these variables (can be set in your shell or via template):

```bash
# Working directory
WORKING_DIRECTORY=/path/to/project

# Git information
IS_GIT_REPO=true
CURRENT_BRANCH=main
MAIN_BRANCH=main

# System information
PLATFORM=darwin  # or linux
OS_VERSION=macOS 14.0

# Date
TODAY_DATE=2025-11-02

# Allowed tools (comma-separated)
ALLOWED_TOOLS=Bash,Read,Write,Edit,MultiEdit,Grep,Glob,LS,Task,TodoWrite,WebFetch,WebSearch,Fabric
```

### Model Configuration

The agent is model-agnostic. Configure your LLM backend:

**For local models (Ollama, LM Studio, etc.):**
```bash
# Example with Ollama
export OPENAI_API_BASE=http://localhost:11434/v1
export OPENAI_API_KEY=ollama
export MODEL_NAME=llama3.1:70b
```

**For cloud models:**
```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# OpenRouter (access multiple models)
export OPENROUTER_API_KEY=sk-or-...
```

### Fabric Setup

If using the Fabric tool:

```bash
# Install
pip install fabric-ai

# Setup (creates ~/.config/fabric)
fabric --setup

# Configure your API keys in ~/.config/fabric/.env
# Add your preferred model

# Update patterns
fabric --update

# List available patterns
fabric --list
```

## Usage

### Running the Agent

The agent is designed to be integrated into a CLI tool. Basic usage pattern:

```bash
# Direct invocation (example)
opencode "Create a new FastAPI project"

# With specific model
opencode --model llama3.1:70b "Refactor this code"

# Interactive mode
opencode --interactive
```

### Tool Usage Examples

**File Operations:**
```bash
# Read a file
Read: file_path=/path/to/file.py

# Edit a file
Edit: file_path=/path/to/file.py, old_string="old code", new_string="new code"

# Write a file
Write: file_path=/path/to/new_file.py, content="..."
```

**Search Operations:**
```bash
# Search for pattern
Grep: pattern="function.*main", path="src/", output_mode="content"

# Find files
Glob: pattern="**/*.py", path="src/"

# List directory
LS: path="/path/to/dir"
```

**Code Operations:**
```bash
# Run command
Bash: command="npm test", description="Run test suite"

# Launch sub-agent
Task: description="Find config", prompt="Search for configuration files"
```

**Fabric Integration:**
```bash
# Extract wisdom from content
Fabric: pattern="extract_wisdom", input="<article content>"

# Generate code
Fabric: pattern="create_coding_project", input="Build a REST API"

# Summarize
Fabric: pattern="summarize", input="<long document>"
```

## Integration with OpenCode CLI

### MCP Integration

The agent can be integrated with Model Context Protocol (MCP):

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

### Custom Tool Implementation

To add custom tools:

1. Create a new `.md` file in `agent/tools/`
2. Follow the YAML frontmatter format:
   ```markdown
   ---
   name: MyTool
   input_schema:
     type: object
     properties:
       param1:
         type: string
         description: Parameter description
     required:
       - param1
   ---
   
   Tool description and usage instructions...
   ```

3. Update the `ALLOWED_TOOLS` list

## Best Practices

1. **Use TodoWrite for complex tasks** - Track progress on multi-step operations
2. **Batch tool calls** - Use multiple tools in parallel when possible
3. **Read before editing** - Always read files before modifying them
4. **Use Grep/Glob over Bash** - Prefer specialized search tools
5. **Keep responses concise** - Follow the CLI-friendly communication style
6. **Verify with tests** - Run tests after code changes
7. **Never commit without asking** - Let users control git operations

## Troubleshooting

### Common Issues

**ripgrep not found:**
```bash
brew install ripgrep  # macOS
apt install ripgrep   # Linux
```

**Fabric patterns not found:**
```bash
fabric --update
```

**Model connection issues:**
```bash
# Check your API keys
echo $OPENAI_API_KEY

# Test connection
curl http://localhost:11434/api/tags  # Ollama
```

**Permission errors:**
```bash
# Ensure proper permissions
chmod +x /path/to/opencode
```

## Development

### Testing the Agent

```bash
# Test individual tools
python -m opencode.agent.test_tools

# Test full workflow
python -m opencode.agent.test_workflow
```

### Extending the Agent

1. Add new tools in `agent/tools/`
2. Update system prompt if needed
3. Test with various models
4. Document in README.md

## MCP Tools

See [MCP_TOOLS.md](./MCP_TOOLS.md) for complete reference of all available MCP tools.

Quick overview of enabled MCP servers:
- **context7** - Library documentation
- **wikipedia** - Wikipedia access
- **duckduckgo** - Web search
- **fetch** - Web content fetching
- **gh_grep** - GitHub code search
- **arxiv** - Research papers
- **paper_search** - Multi-source papers
- **code_interpreter** - Python execution
- **sequential_thinking** - Structured reasoning
- **memory** - Knowledge graph storage

## Resources

- [MCP Tools Reference](./MCP_TOOLS.md) - Complete MCP tool documentation
- [Fabric Documentation](https://github.com/danielmiessler/fabric)
- [ripgrep Documentation](https://github.com/BurntSushi/ripgrep)
- [MCP Protocol](https://modelcontextprotocol.io)
- [OpenCode Repository](https://github.com/yourusername/opencode)

## Support

For issues or questions:
- Check the troubleshooting section
- Review tool documentation in `agent/tools/`
- Open an issue on GitHub
