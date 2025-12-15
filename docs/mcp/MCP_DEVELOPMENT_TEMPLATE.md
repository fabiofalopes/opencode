# 🚀 MCP Server Development Template & Guide

## 📋 Overview
This template provides a standardized approach for creating custom Model Context Protocol (MCP) servers with Docker integration. Use this as your blueprint for connecting any tool, API, or service to AI assistants.

---

## 🛠️ Core MCP Development Process

### 1. Project Setup
```bash
# Create project directory
mkdir my-mcp-server
cd my-mcp-server

# Initialize Python environment
uv init
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv add "mcp[cli]" "your-api-library"

# Create main server file
touch server.py
```

### 2. Basic Server Structure (server.py)
```python
from typing import Any
import logging
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server with your server name
mcp = FastMCP("your-server-name")

# Configure logging (IMPORTANT: never use print() for stdio servers)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
API_BASE = "https://your-api-endpoint.com"
API_KEY = None  # Will be set from environment or Docker secrets

# Helper functions
async def make_api_request(endpoint: str, params: dict = None) -> dict[str, Any] | None:
    """Make authenticated API request with error handling."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        # Your API logic here
        # response = await httpx.get(endpoint, headers=headers, params=params)
        # return response.json()
        pass
    except Exception as e:
        logger.error(f"API request failed: {e}")
        return None

# Define your MCP tools
@mcp.tool()
async def your_tool_function(param1: str, param2: int = 10) -> str:
    """
    Your tool description for the AI to understand.
    
    Args:
        param1: Description of what param1 does
        param2: Description of optional param2
    """
    logger.info(f"Tool called with param1={param1}, param2={param2}")
    
    # Your tool logic here
    # Call APIs, process data, return results
    
    return "Tool results"

# Server initialization
def main():
    """Run the MCP server."""
    global API_KEY
    API_KEY = os.getenv("API_KEY")  # Load from environment or secrets
    
    if not API_KEY:
        logger.error("API_KEY not provided in environment")
        exit(1)
    
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## 🐳 Docker Setup for MCP Servers

### 1. Dockerfile Template
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast Python package management
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy requirements
COPY pyproject.toml ./
COPY uv.lock* ./
RUN if [ -f uv.lock ]; then uv sync --frozen; else uv pip install --no-cache -r pyproject.toml; fi

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

# Expose port for HTTP transport (optional)
EXPOSE 8080

# Default command
CMD ["uv", "run", "server.py"]
```

### 2. Docker Compose Template
```yaml
version: '3.8'

services:
  Your-MCP-Server:
    build: .
    container_name: your-mcp-server
    environment:
      - API_KEY=${API_KEY}
      - OTHER_CONFIG=${OTHER_CONFIG:-default_value}
    ports:
      - "8080:8080"  # For HTTP transport
    restart: unless-stopped
    networks:
      - mcp-network

networks:
  mcp-network:
    external: true  # Connect to Docker MCP Gateway
```

---

## 🔧 MCP Tool Design Patterns

### Pattern 1: API Integration
```python
@mcp.tool()
async def get_data_from_api(query: str, limit: int = 10) -> str:
    """Fetch data from external API."""
    
    # Build API request
    params = {'q': query, 'limit': limit}
    data = await make_api_request("/search", params)
    
    if not data:
        return "No results found."
    
    # Format results for AI consumption
    results = []
    for item in data.get('items', []):
        results.append(f"- {item['name']}: {item['description']}")
    
    return f"Found {len(results)} results:\n" + "\n".join(results)
```

### Pattern 2: File Operations
```python
@mcp.tool()
async def analyze_file(file_path: str) -> str:
    """Analyze contents of a file."""
    
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Perform analysis
        stats = {
            'lines': len(content.split('\n')),
            'words': len(content.split()),
            'size_bytes': len(content.encode())
        }
        
        result = f"File analysis for {file_path}:\n"
        for key, value in stats.items():
            result += f"- {key}: {value}\n"
        
        return result
    except Exception as e:
        return f"Error analyzing file: {str(e)}"
```

### Pattern 3: Multiple Tools with Shared Logic
```python
class ToolManager:
    def __init__(self):
        self.api_key = os.getenv("API_KEY")
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    async def _make_request(self, endpoint: str, params: dict = None):
        headers = {"Authorization": f"Bearer {self.api_key}"}
        response = await self.client.get(endpoint, headers=headers, params=params)
        response.raise_for_status()
        return response.json()

@mcp.tool()
async def get_info():
    """Get basic information."""
    async with ToolManager() as manager:
        data = await manager._make_request("/info")
        return f"Info: {data['description']}"

@mcp.tool() 
async def get_stats():
    """Get statistics."""
    async with ToolManager() as manager:
        data = await manager._make_request("/stats")
        return f"Stats: {data['total_count']} items"
```

---

## 🏗️ Advanced Features

### 1. Resources (File-like Data)
```python
@mcp.resource("info://about")
async def read_info_resource() -> str:
    """Provide server information as a resource."""
    return "This MCP server provides data integration tools."

@mcp.resource("logs://recent")
async def read_logs_resource() -> str:
    """Provide recent logs as a resource."""
    log_file = "/app/logs/recent.log"
    if os.path.exists(log_file):
        with open(log_file, 'r') as f:
            return f.read()
    return "No recent logs available."
```

### 2. Prompts (Pre-written Templates)
```python
@mcp.prompt()
async def data_analysis_prompt() -> str:
    """Generate a prompt for data analysis."""
    return """
    Please analyze the following data and provide insights:
    
    {data}
    
    Provide your analysis in a structured format:
    1. Key findings
    2. Trends identified
    3. Recommendations
    """
```

---

## 🔐 Security Best Practices

### 1. Secret Management
```python
import os
from pathlib import Path

def load_secrets():
    """Load secrets from Docker secrets or environment variables."""
    secrets = {}
    
    # Docker secrets path
    secrets_dir = Path("/run/secrets")
    if secrets_dir.exists():
        for secret_file in secrets_dir.iterdir():
            if secret_file.is_file():
                secrets[secret_file.name] = secret_file.read_text().strip()
    
    # Environment variables fallback
    secrets['api_key'] = os.getenv('API_KEY')
    
    return secrets
```

### 2. Input Validation
```python
@mcp.tool()
async def safe_tool(string_param: str, number_param: int, file_path: str = None) -> str:
    """Validate and sanitize inputs."""
    
    # Validate string parameter
    if len(string_param) > 1000:
        return "string_param too long (max 1000 characters)"
    
    if any(char in string_param for char in "<>()$"):
        return "Invalid characters in string_param"
    
    # Validate number parameter
    if not isinstance(number_param, int):
        return "number_param must be an integer"
    
    if number_param < 0 or number_param > 100000:
        return "number_param out of range (0-100000)"
    
    # Validate file path (if provided)
    if file_path:
        try:
            path = Path(file_path).resolve()
            # Ensure path is within allowed directory
            allowed_base = Path("/app/data").resolve()
            if not str(path).startswith(str(allowed_base)):
                return "file_path outside allowed directory"
        except Exception:
            return "Invalid file_path"
    
    # Process validated inputs
    return "Tool executed successfully"
```

---

## 🚀 Deployment Strategies

### 1. Local Development
```bash
# Install dependencies
uv pip install -e .

# Run server
uv run server.py

# Test with MCP Inspector
npx @modelcontextprotocol/inspector
```

### 2. Docker Deployment
```bash
# Build image
docker build -t my-mcp-server .

# Run container
docker run -d \
  --name my-mcp-server \
  -e API_KEY=your_api_key \
  -p 8080:8080 \
  my-mcp-server
```

### 3. Docker MCP Gateway Integration
```bash
# Register with Docker MCP Gateway (if using Docker Desktop)
docker mcp server register my-mcp-server:latest --transport stdio

# List registered servers
docker mcp server list
```

---

## 🧪 Testing Your MCP Server

### 1. Unit Testing
```python
# tests/test_server.py
import pytest
from server import YourToolFunction

@pytest.mark.asyncio
async def test_tool_function():
    """Test your tool function."""
    result = await your_tool_function("test_input", 42)
    assert "expected_output" in result
```

### 2. Integration Testing with Claude Desktop
```json
{
  "mcpServers": {
    "test-server": {
      "command": "uv",
      "args": [
        "--directory",
        "/absolute/path/to/your/project",
        "run",
        "server.py"
      ],
      "env": {
        "API_KEY": "test_key"
      }
    }
  }
}
```

---

## 🎯 Quick Start Checklist

- [ ] **Define Tool Purpose**: What specific functionality do you want to expose?
- [ ] **Sketch Tool Interface**: What parameters should your tools accept?
- [ ] **Set Up Project Structure**: Use the templates above
- [ ] **Implement Tool Logic**: Start with simple functionality
- [ ] **Add Error Handling**: Ensure robust error messages
- [ ] **Configure Docker**: Create Dockerfile and docker-compose.yml
- [ ] **Test Locally**: Use MCP Inspector
- [ ] **Deploy**: Use Docker deployment strategy
- [ ] **Monitor**: Add logging and health checks

---

## 📚 Additional Resources

- **Official MCP Documentation**: https://modelcontextprotocol.io/
- **Python MCP SDK**: https://github.com/modelcontextprotocol/python-sdk
- **Docker MCP Toolkit**: https://docs.docker.com/ai/mcp-catalog-and-toolkit/
- **MCP Inspector**: https://github.com/modelcontextprotocol/inspector
- **NetworkChuck Tutorial**: https://github.com/theNetworkChuck/docker-mcp-tutorial

---

## 💡 Ideas for Custom MCP Servers

1. **Database Integration**: Connect to your company databases
2. **API Wrappers**: Wrap existing APIs (CRM, project management, analytics)
3. **File Processing**: Document analysis, data extraction
4. **Communication Tools**: Slack, email, notifications
5. **DevOps Tools**: Git operations, deployment, monitoring
6. **Business Logic**: Company-specific calculations, reports
7. **External Services**: Payment processing, scheduling, communications
8. **Data Transformation**: Cleaning, formatting, analysis

---

*Keep this template handy when developing MCP servers for any new integration needs!*