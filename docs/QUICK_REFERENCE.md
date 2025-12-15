# OpenCode Agent Quick Reference

## Agent Profiles

Switch between profiles for different use cases:

```bash
opencode --agent default    # General purpose (most tools)
opencode --agent research   # Research focused
opencode --agent code       # Development focused
opencode --agent thinking   # Problem solving
```

## Common Workflows

### Code Development
```
1. Grep/Glob - Find relevant files
2. Read - Understand existing code
3. Edit/MultiEdit - Make changes
4. Bash - Run tests
5. TodoWrite - Track progress
```

### Research & Learning
```
1. mcp_duckduckgo_search - Find resources
2. mcp_fetch_fetch - Get content
3. mcp_wikipedia_search - Background info
4. mcp_context7_get_library_docs - API docs
5. mcp_memory_create_entities - Store knowledge
```

### Academic Research
```
1. mcp_arxiv_search_papers - Find papers
2. mcp_arxiv_download_paper - Download
3. mcp_arxiv_read_paper - Read content
4. mcp_sequential_thinking - Analyze
5. Write - Document findings
```

### Problem Solving
```
1. mcp_sequential_thinking - Break down problem
2. mcp_memory_search_nodes - Check existing knowledge
3. mcp_code_interpreter_execute_code - Test solutions
4. TodoWrite - Track steps
5. Edit - Implement solution
```

## Quick Commands

### File Operations
```python
Read(file_path="/path/to/file.py")
Write(file_path="/path/to/new.py", content="...")
Edit(file_path="/path/to/file.py", old_string="...", new_string="...")
```

### Search
```python
Grep(pattern="function.*main", path="src/", output_mode="content")
Glob(pattern="**/*.py", path="src/")
```

### Bash
```python
Bash(command="npm test", description="Run test suite")
Bash(command="git status", description="Check git status")
```

### MCP - Documentation
```python
mcp_context7_get_library_docs(
    context7CompatibleLibraryID="/vercel/next.js",
    topic="routing"
)
```

### MCP - Search
```python
mcp_duckduckgo_search(query="FastAPI tutorial", max_results=10)
mcp_wikipedia_search_wikipedia(query="machine learning", limit=5)
mcp_arxiv_search_papers(query="transformers", categories=["cs.AI"])
```

### MCP - Execute
```python
mcp_code_interpreter_execute_code(code="print('Hello')")
```

### MCP - Memory
```python
mcp_memory_create_entities(entities=[{
    "name": "Project X",
    "entityType": "project",
    "observations": ["Uses FastAPI", "PostgreSQL"]
}])
```

### MCP - Thinking
```python
mcp_sequential_thinking_sequentialthinking(
    thought="First step...",
    thoughtNumber=1,
    totalThoughts=5,
    nextThoughtNeeded=true
)
```

### Fabric
```bash
# In terminal
echo "content" | fabric --pattern extract_wisdom
cat file.md | fabric --pattern summarize
yt VIDEO_URL | fabric --pattern extract_wisdom
```

## Task Management

```python
TodoWrite(todos=[
    {
        "id": "1",
        "content": "Setup database",
        "status": "in_progress",
        "priority": "high"
    },
    {
        "id": "2",
        "content": "Create API endpoints",
        "status": "pending",
        "priority": "medium"
    }
])
```

## Git Operations

```python
# Check status
Bash(command="git status", description="Check git status")

# Create commit
Bash(command='git commit -m "$(cat <<\'EOF\'\nAdd authentication\nEOF\n)"')

# Create PR (requires gh CLI)
Bash(command='gh pr create --title "Add auth" --body "..."')
```

## Environment Info

Available variables:
- `${WORKING_DIRECTORY}` - Current directory
- `${IS_GIT_REPO}` - Git repo status
- `${PLATFORM}` - OS platform
- `${TODAY_DATE}` - Current date
- `${CURRENT_BRANCH}` - Git branch
- `${ALLOWED_TOOLS}` - Available tools

## Tips

1. **Read before editing** - Always read files before modifying
2. **Use Grep/Glob** - Don't use bash grep/find
3. **Batch operations** - Call multiple tools in parallel
4. **Track complex tasks** - Use TodoWrite for multi-step work
5. **Store knowledge** - Use memory for important context
6. **Think through problems** - Use sequential_thinking for complex issues
7. **Never commit without asking** - Let users control git
8. **Keep responses concise** - CLI-friendly communication

## Keyboard Shortcuts (OpenCode)

- `Ctrl+P` - List sessions
- `Ctrl+X L` - Switch model
- `Ctrl+X M` - Switch agent
- `Tab` - Autocomplete
- `Q` - Quit

## Configuration Files

- `~/.config/opencode/opencode.json` - Main config
- `~/.config/opencode/agent/` - Agent definitions
- `~/.config/fabric/` - Fabric patterns
- `~/mcp-memory/` - Memory storage
- `~/arxiv-papers/` - Downloaded papers

## Troubleshooting

**Tool not found:**
- Check agent profile configuration
- Verify MCP server is enabled
- Restart OpenCode

**MCP server error:**
- Check Docker is running
- Verify environment variables
- Check server logs

**Permission denied:**
- Check file permissions
- Verify working directory
- Check Docker volume mounts

## Resources

- [Full Documentation](./README.md)
- [Setup Guide](./SETUP.md)
- [MCP Tools Reference](./MCP_TOOLS.md)
- [Tool Definitions](./tools/)
