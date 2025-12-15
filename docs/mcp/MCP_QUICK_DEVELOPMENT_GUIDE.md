# 🚀 MCP Server Development Guide

## Quick Reference for Building Custom MCP Servers

This document outlines the complete process for creating custom MCP servers to connect any service, API, or tool to AI assistants.

## Development Workflow

### Step 1: Project Creation
```bash
mkdir my-mcp-project
cd my-mcp-project
uv init
uv venv && source .venv/bin/activate
uv add "mcp[cli]" httpx  # Add your API libraries
```

### Step 2: Server Implementation
```python
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("your-server-name")

@mcp.tool()
async def tool_name(param: str) -> str:
    """Tool description for AI."""
    return f"Result for {param}"

def main():
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

### Step 3: Docker Integration
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "server.py"]
```

### Step 4: Testing
1. Start server: `uv run server.py`
2. Test with MCP Inspector: `npx @modelcontextprotocol/inspector`
3. Configure Claude Desktop with config file

## MCP Capabilities Template

**Tools** (Functions AI can call):
```python
@mcp.tool()
async def function_name(param: type) -> Result:
    """Describe when AI should use this tool."""
    pass
```

**Resources** (Data files AI can read):
```python
@mcp.resource("domain://resource-name")
async def get_resource() -> str:
    return "Resource content"
```

**Prompts** (Templates for AI):
```python
@mcp.prompt()
async def prompt_name() -> str:
    return "Template with {variables}"  
```

## Development Checklist
- [ ] Define what service/API to expose
- [ ] Create server structure with FastMCP
- [ ] Implement tools with proper descriptions
- [ ] Add error handling and validation
- [ ] Create Dockerfile and docker-compose
- [ ] Test locally with MCP Inspector
- [ ] Configure Claude Desktop for testing
- [ ] Add logging (never use print() with stdio)
- [ ] Implement secret management
- [ ] Write integration tests

## Example Implementations

**API Integration Pattern**:
```python
async def api_request(endpoint: str):
    headers = {"Authorization": os.getenv("API_KEY")}
    response = await httpx.get(endpoint, headers=headers)
    return response.json()

@mcp.tool()
async def search_items(query: str):
    data = await api_request(f"/search?q={query}")
    return "Results: " + format_results(data)
```

**Database Pattern**:
```python
@mcp.tool()
async def query_data(sql: str, limit: int = 10):
    """Query database safely with LIMIT."""
    if not sql.strip().lower().startswith("select"):
        return "Only SELECT queries allowed"
    return await execute_query(sql + f" LIMIT {limit}")
```

**File Operations Pattern**:
```python
@mcp.tool()
async def analyze_file(file_path: str):
    """Safe file analysis within allowed directories."""
    path = Path(file_path).resolve()
    if not str(path).startswith(str(ALLOWED_DIR)):
        return "File outside allowed directories"
    return analyze_content(path.read_text())
```

## Docker MCP Gateway Integration

**Local Testing**:
```bash
docker build -t my-mcp-server .
docker run -e API_KEY=$API_KEY -p 8080:8080 my-mcp-server
```

**Gateway Integration**:
```bash
docker mcp server register my-mcp-server:latest --transport stdio
docker mcp secret set API_KEY your_key_here
```

## Debugging Guide

**Tools not appearing in Claude?**
1. Restart Claude Desktop
2. Check server is running
3. Verify config file format
4. Check server logs

**Authentication failures?**
```bash
docker mcp secret list  # Verify secrets
docker logs container_name  # Check logs
```

**STDIO vs HTTP transport?**
- **STDIO**: Local development, direct execution
- **HTTP**: Network access, Docker deployment

## Best Practices

1. **Never use print()** with stdio transport - use logging instead
2. **Validate all inputs** for security
3. **Provide clear descriptions** so AI knows when to use each tool
4. **Handle errors gracefully** with helpful messages
5. **Use absolute paths** in config files
6. **Implement rate limiting** for external APIs
7. **Add validation** before external requests
8. **Use environment variables** for configuration

## Security Guidelines

- Use Docker secrets management: `/run/secrets/`
- Validate file paths to prevent directory traversal
- Implement input sanitization
- Use logging instead of stdout for debugging
- Implement authentication for sensitive operations
- Add request timeouts for external APIs
- Sanitize error messages to avoid information leakage

## Resources

- MCP Specification: https://modelcontextprotocol.io/
- Python SDK: https://github.com/modelcontextprotocol/python-sdk  
- MCP Inspector: https://github.com/modelcontextprotocol/inspector
- Docker MCP: https://docs.docker.com/ai/mcp-catalog-and-toolkit/
- NetworkChuck Tutorial: https://github.com/theNetworkChuck/docker-mcp-tutorial