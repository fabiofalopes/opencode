# OpenCode Agent - Complete Index

## 📚 Documentation Structure

```
agent/
├── 📖 README.md              # Start here - Agent overview
├── 🚀 SETUP.md               # Installation and configuration
├── ⚡ QUICK_REFERENCE.md     # Common commands and workflows
├── 🔧 MCP_TOOLS.md           # Complete MCP tool reference
├── 🖥️  SYSTEM_CONTEXT.md     # System configuration and context
├── 📋 INDEX.md               # This file - Complete index
├── 📝 system-prompt.md       # Main system prompt
├── 📝 system-prompt.j2       # Jinja2 template version
└── 🛠️  tools/                # 16 tool definitions
    ├── Bash.md               # Shell command execution
    ├── Edit.md               # File editing
    ├── Fabric.md             # AI pattern processing
    ├── Glob.md               # File pattern matching
    ├── Grep.md               # Code search
    ├── LS.md                 # Directory listing
    ├── MultiEdit.md          # Batch file edits
    ├── NotebookEdit.md       # Jupyter editing
    ├── NotebookRead.md       # Jupyter reading
    ├── Read.md               # File reading
    ├── Task.md               # Sub-agent launching
    ├── TodoWrite.md          # Task management
    ├── WebFetch.md           # Web content fetching
    ├── WebSearch.md          # Web search
    ├── Write.md              # File writing
    └── exit-plan-mode.md     # Planning mode exit
```

## 🎯 Quick Navigation

### For New Users
1. Start with [README.md](./README.md) - Understand what the agent does
2. Follow [SETUP.md](./SETUP.md) - Get everything installed
3. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Learn common commands

### For Developers
1. Read [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md) - Understand system capabilities
2. Review [system-prompt.md](./system-prompt.md) - See agent instructions
3. Browse [tools/](./tools/) - Individual tool documentation

### For Power Users
1. Study [MCP_TOOLS.md](./MCP_TOOLS.md) - Master all 50+ MCP tools
2. Explore [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Advanced workflows
3. Customize [system-prompt.j2](./system-prompt.j2) - Adapt to your needs

## 📊 Agent Capabilities

### Built-in Tools (16)
- **File Operations**: Read, Write, Edit, MultiEdit
- **Search**: Grep, Glob, LS
- **Execution**: Bash, Task
- **Notebooks**: NotebookRead, NotebookEdit
- **Web**: WebFetch, WebSearch
- **AI**: Fabric
- **Management**: TodoWrite, ExitPlanMode

### MCP Tools (50+)
- **Documentation**: context7 (2 tools)
- **Research**: wikipedia (10), arxiv (4), paper_search (15)
- **Search**: duckduckgo (2), gh_grep (1), fetch (1)
- **Development**: code_interpreter (1), github (10+)
- **Cognitive**: sequential_thinking (1), memory (9)
- **Content**: obsidian (10), perplexity (1), brave (1)

## 🔍 Find What You Need

### Installation & Setup
- **Install dependencies**: [SETUP.md](./SETUP.md#prerequisites)
- **Configure MCP**: [SETUP.md](./SETUP.md#mcp-integration)
- **Setup Fabric**: [SETUP.md](./SETUP.md#fabric-setup)
- **Environment variables**: [SETUP.md](./SETUP.md#environment-variables)

### Using Tools
- **Built-in tools**: [tools/](./tools/) directory
- **MCP tools**: [MCP_TOOLS.md](./MCP_TOOLS.md)
- **Fabric patterns**: [tools/Fabric.md](./tools/Fabric.md)
- **Quick commands**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Understanding the Agent
- **Capabilities**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#agent-capabilities)
- **Communication style**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#communication-style)
- **Task management**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#task-management)
- **Best practices**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#security--best-practices)

### Workflows
- **Code development**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#code-development)
- **Research**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#research--learning)
- **Academic research**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#academic-research)
- **Problem solving**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#problem-solving)

### Configuration
- **Agent profiles**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#agent-profiles)
- **MCP servers**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#active-mcp-servers)
- **System tools**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#system-tools)
- **Data directories**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#data-directories)

### Troubleshooting
- **Common issues**: [SETUP.md](./SETUP.md#troubleshooting)
- **MCP errors**: [MCP_TOOLS.md](./MCP_TOOLS.md#troubleshooting)
- **Error handling**: [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md#error-handling)
- **Quick fixes**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#troubleshooting)

## 📖 Documentation by Topic

### File Operations
- [Read.md](./tools/Read.md) - Read files (text, images, PDFs)
- [Write.md](./tools/Write.md) - Write new files
- [Edit.md](./tools/Edit.md) - Edit existing files
- [MultiEdit.md](./tools/MultiEdit.md) - Multiple edits at once
- [LS.md](./tools/LS.md) - List directories

### Search & Discovery
- [Grep.md](./tools/Grep.md) - Search code with ripgrep
- [Glob.md](./tools/Glob.md) - Find files by pattern
- [mcp_duckduckgo](./MCP_TOOLS.md#duckduckgo---web-search) - Web search
- [mcp_gh_grep](./MCP_TOOLS.md#gh_grep---github-search) - GitHub search
- [mcp_wikipedia](./MCP_TOOLS.md#wikipedia---wikipedia-access) - Wikipedia

### Code Execution
- [Bash.md](./tools/Bash.md) - Shell commands
- [mcp_code_interpreter](./MCP_TOOLS.md#code_interpreter---python-execution) - Python execution
- [Task.md](./tools/Task.md) - Launch sub-agents

### Research & Learning
- [mcp_context7](./MCP_TOOLS.md#context7---library-documentation) - Library docs
- [mcp_arxiv](./MCP_TOOLS.md#arxiv---research-papers) - Research papers
- [mcp_paper_search](./MCP_TOOLS.md#paper_search---multi-source-papers) - Multi-source papers
- [mcp_fetch](./MCP_TOOLS.md#fetch---web-content-fetcher) - Fetch web content

### AI & Cognitive
- [Fabric.md](./tools/Fabric.md) - AI patterns
- [mcp_sequential_thinking](./MCP_TOOLS.md#sequential_thinking---structured-reasoning) - Structured reasoning
- [mcp_memory](./MCP_TOOLS.md#memory---knowledge-graph) - Knowledge storage

### Task Management
- [TodoWrite.md](./tools/TodoWrite.md) - Task tracking
- [ExitPlanMode.md](./tools/exit-plan-mode.md) - Planning mode

### Notebooks
- [NotebookRead.md](./tools/NotebookRead.md) - Read Jupyter notebooks
- [NotebookEdit.md](./tools/NotebookEdit.md) - Edit Jupyter notebooks

### Web
- [WebFetch.md](./tools/WebFetch.md) - Fetch web content
- [WebSearch.md](./tools/WebSearch.md) - Search the web

## 🎓 Learning Path

### Beginner
1. Read [README.md](./README.md) - Understand the basics
2. Follow [SETUP.md](./SETUP.md) - Get set up
3. Try [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) examples
4. Practice with simple file operations

### Intermediate
1. Learn [MCP_TOOLS.md](./MCP_TOOLS.md) - Explore MCP capabilities
2. Study [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md) - Understand system
3. Master common workflows
4. Use TodoWrite for complex tasks

### Advanced
1. Customize [system-prompt.j2](./system-prompt.j2) - Adapt agent
2. Create custom Fabric patterns
3. Build complex workflows with MCP tools
4. Integrate with CI/CD pipelines

## 🔗 External Resources

- [Fabric GitHub](https://github.com/danielmiessler/fabric) - AI pattern framework
- [ripgrep GitHub](https://github.com/BurntSushi/ripgrep) - Fast search tool
- [MCP Protocol](https://modelcontextprotocol.io) - Model Context Protocol
- [OpenCode](https://opencode.ai) - OpenCode platform

## 📝 Quick Stats

- **Total Documentation Files**: 7
- **Built-in Tools**: 16
- **MCP Servers**: 14
- **Total MCP Tools**: 50+
- **Agent Profiles**: 4 (default, research, code, thinking)
- **Supported File Types**: Text, Images, PDFs, Jupyter Notebooks
- **Supported Languages**: All (model-dependent)

## 🆘 Getting Help

1. **Check documentation** - Start with this index
2. **Read QUICK_REFERENCE.md** - Common solutions
3. **Review SYSTEM_CONTEXT.md** - Understand capabilities
4. **Check MCP_TOOLS.md** - Tool-specific help
5. **Read tool docs** - Individual tool details

## 🚀 Next Steps

**Just starting?**
→ Go to [README.md](./README.md)

**Ready to install?**
→ Go to [SETUP.md](./SETUP.md)

**Want quick commands?**
→ Go to [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Need MCP tools?**
→ Go to [MCP_TOOLS.md](./MCP_TOOLS.md)

**Want to understand the system?**
→ Go to [SYSTEM_CONTEXT.md](./SYSTEM_CONTEXT.md)

---

**Last Updated**: 2024-11-02  
**Version**: 1.0  
**Agent**: OpenCode Agent (adapted from Claude Code)
