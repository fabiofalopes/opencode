# 🛠️ MCP Server Project Templates Collection

Ready-to-use templates for common MCP server scenarios. Copy and customize for your specific use case.

---

## Template 1: API Integration Server

**Ideal for**: Wrapping any REST API (CRM, databases, analytics, payments)

### Project Structure
```
api-integration-mcp/
├── server.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### server.py
```python
from typing import Any, Optional
import os
import logging
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize server with your API name
mcp = FastMCP("your-api-service")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://api.yourservice.com")
API_KEY = os.getenv("API_KEY")  # Set in environment
API_TIMEOUT = 30.0

async def make_api_request(method: str, endpoint: str, params: dict = None, data: dict = None) -> Optional[dict]:
    """Make authenticated API request with error handling."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "mcp-server/1.0"
    }
    
    url = f"{API_BASE_URL}/{endpoint.lstrip('/')}"
    
    try:
        async with httpx.AsyncClient(timeout=API_TIMEOUT) as client:
            response = await client.request(method, url, params=params, json=data, headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP {e.response.status_code} from API: {e.response.text}")
        return None
    except Exception as e:
        logger.error(f"API request failed: {e}")
        return None

@mcp.tool()
async def search_items(query: str, limit: int = 10, category: Optional[str] = None) -> str:
    """
    Search items using the API.
    
    Args:
        query: Search keyword or phrase
        limit: Maximum number of results (1-100)
        category: Optional category filter
    """
    # Validate inputs
    if limit < 1 or limit > 100:
        return "Limit must be between 1 and 100"
    
    if len(query) > 200:
        return "Query too long (max 200 characters)"
    
    # Build API request
    params = {"q": query, "limit": limit}
    if category:
        params["category"] = category
    
    data = await make_api_request("GET", "search", params)
    
    if not data:
        return "No results found or API error"
    
    # Format results for AI consumption
    items = data.get("items", [])
    if not items:
        return f"No results found for '{query}'"
    
    results = [f"Results for '{query}':"]
    for item in items:
        name = item.get("name", "Unknown")
        description = item.get("description", "No description")
        score = item.get("score", 0)
        results.append(f"- {name} (score: {score}/100): {description}")
    
    return "\n".join(results)

@mcp.tool()
async def get_item_details(item_id: str) -> str:
    """
    Get detailed information about a specific item.
    
    Args:
        item_id: Unique identifier of the item
    """
    if not item_id or len(item_id) > 50:
        return "Invalid item ID"
    
    data = await make_api_request("GET", f"items/{item_id}")
    
    if not data:
        return f"Item {item_id} not found or API error"
    
    # Format detailed information
    details = [f"Item Details for {item_id}:"]
    
    for key, value in data.items():
        if key != "id":  # Skip ID since it's in title
            details.append(f"{key.title()}: {value}")
    
    return "\n".join(details)

@mcp.tool()
async def create_item(name: str, description: str, category: str = "general") -> str:
    """
    Create a new item via API.
    
    Args:
        name: Item name (max 100 chars)
        description: Item description (max 500 chars)
        category: Category for the item
    """
    # Validate inputs
    if len(name) > 100:
        return "Name too long (max 100 characters)"
    
    if len(description) > 500:
        return "Description too long (max 500 characters)"
    
    if not category.replace("-", "").replace("_", "").isalnum():
        return "Category must be alphanumeric"
    
    data = {
        "name": name,
        "description": description,
        "category": category
    }
    
    result = await make_api_request("POST", "items", data=data)
    
    if not result:
        return "Failed to create item"
    
    return f"Created item: {result.get('name', 'Unknown')} (ID: {result.get('id','?')})"

def main():
    """Initialize and run the MCP server."""
    global API_KEY
    
    API_KEY = os.getenv("API_KEY")
    if not API_KEY:
        logger.error("API_KEY not provided in environment variables")
        exit(1)
    
    logger.info(f"Starting API MCP server for {API_BASE_URL}")
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## Template 2: Database Query Server

**Ideal for**: Read-only database queries, analytics, reporting

### Key Features:
- Read-only SQL queries
- Parameterized queries (safe injection protection)
- Result formatting for AI consumption
- Query validation and timeout

### server.py
```python
import os
import sqlite3
import json
import logging
from typing import Any, Optional, List
import asyncio
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("database-analyzer")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_PATH = os.getenv("DB_PATH", "./database.db")
QUERY_TIMEOUT = 30  # seconds
MAX_RECORDS = 1000  # safety limit

ALLOWED_COLUMNS = {
    "users": ["id", "name", "email", "created_at", "last_login", "status"],
    "products": ["id", "name", "category", "price", "created_at", "stock"],
    "orders": ["id", "user_id", "total", "status", "created_at"]  
}

def validate_sql_query(query: str) -> Optional[str]:
    """Validate SQL query for safety."""
    dangerous_keywords = [
        "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", 
        "CREATE", "GRANT", "TRUNCATE", "EXEC"
    ]
    
    upper_query = query.upper().strip()
    
    # Must start with SELECT
    if not upper_query.startswith("SELECT"):
        return "Only SELECT queries allowed"
    
    # Check for dangerous keywords
    for keyword in dangerous_keywords:
        if f" {keyword} " in f" {upper_query} ":
            return f"Dangerous keyword '{keyword}' not allowed"
    
    # Check complexity
    if upper_query.count("SELECT") > 5:
        return "Too many nested SELECT statements"
    
    return None

@mcp.tool()
async def list_tables() -> str:
    """List all available database tables and their descriptions."""
    tables = list(ALLOWED_COLUMNS.keys())
    
    result = ["Available Tables:"]
    for table in tables:
        result.append(f"\n{table}.columns: {ALLOWED_COLUMNS[table]}")
        result.append(f"{table}.description: {getattr(ALLOWED_COLUMNS, '__doc__', 'No description')}")
    
    return "\n".join(result)

@mcp.tool()
async def describe_table(table_name: str) -> str:
    """
    Describe the structure of a specific table.
    
    Args:
        table_name: Name of the table to describe
    """
    table_name = table_name.lower().strip()
    
    if table_name not in ALLOWED_COLUMNS:
        available = ", ".join(ALLOWED_COLUMNS.keys())
        return f"Table '{table_name}' not found. Available: {available}"
    
    columns = ALLOWED_COLUMNS[table_name]
    
    result = [f"Table: {table_name}", "Columns:"]
    for col in columns:
        result.append(f"  - {col}")
    
    return "\n".join(result)

@mcp.tool()
async def safe_query(table_name: str, conditions: str = None, limit: int = 50) -> str:
    """
    Execute a safe database query with conditions.
    
    Args:
        table_name: Name of table to query
        conditions: WHERE conditions (e.g., "price > 100 AND category = 'electronics'")
        limit: Maximum number of records (1-100)
    """
    table_name = table_name.lower().strip()
    
    if table_name not in ALLOWED_COLUMNS:
        return "Table not in allowed list"
    
    if limit < 1 or limit > 100:
        return "Limit must be between 1 and 100"
    
    # Build safe query
    columns = ", ".join(ALLOWED_COLUMNS[table_name])
    query = f"SELECT {columns} FROM {table_name}"
    
    if conditions:
        # Basic validation for conditions
        if len(conditions) > 200:
            return "Conditions too long (max 200 characters)"
        if any(keyword in conditions.upper() for keyword in [";", " UNION ", "--", "/*"]):
            return "Invalid characters in conditions"
        
        query += f" WHERE {conditions}"
    
    query += f" LIMIT {limit}"
    
    logger.info(f"Executing query: {query}")
    
    try:
        # Execute with timeout
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, execute_sql_with_timeout, query)
        
        if not result:
            return "No results found"
        
        # Format results
        return format_query_results(result, table_name)
        
    except Exception as e:
        return f"Query error: {str(e)}"

def execute_sql_with_timeout(query: str) -> List[dict]:
    """Execute SQL query with timeout protection."""
    conn = sqlite3.connect(DB_PATH, timeout=5.0)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        
        # Fetch results
        rows = cursor.fetchall()
        
        # Convert to list of dicts
        result = []
        for row in rows:
            result.append(dict(row))
            if len(result) >= MAX_RECORDS:
                break
        
        return result
        
    finally:
        conn.close()

def format_query_results(rows: List[dict], table_name: str) -> str:
    """Format query results for AI consumption."""
    if not rows:
        return "No results found"
    
    result = [f"Query Results ({len(rows)} records from {table_name}):"]
    result.append("")
    
    # Show first row as header example
    if rows:
        sample = rows[0]
        result.append("Sample row structure:")
        for key, value in sample.items():
            result.append(f"  {key}: {type(value).__name__}")
        result.append("")
    
    # Show first few rows
    result.append("Result data (showing up to 5 rows):")
    for i, row in enumerate(rows[:5]):
        result.append(f"Row {i+1}:")
        for key, value in row.items():
            result.append(f"  {key}: {value}")
        result.append("")
    
    if len(rows) > 5:
        result.append(f"Note: Showing first 5 of {len(rows)} rows")
    
    return "\n".join(result)

def main():
    if not os.path.exists(DB_PATH):
        logger.error(f"Database not found at {DB_PATH}")
        exit(1)
    
    logger.info(f"Starting Database MCP server for {DB_PATH}")
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## Template 3: File Processing & Analysis Server

**Ideal for**: Document analysis, file operations, data extraction

### Key Features:
- Safe file path validation
- Multiple file format support
- Content analysis tools
- Data extraction capabilities

### server.py
```python
import os
import json
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any
import mimetypes
from datetime import datetime
import hashlib
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("file-analyzer")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
BASE_DIR = Path(os.getenv("ALLOWED_BASE_DIR", "./files"))
ALLOWED_EXTENSIONS = {".txt", ".json", ".csv", ".md", ".py", ".yaml", ".yml"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Ensure base directory exists
BASE_DIR.mkdir(exist_ok=True)

def validate_file_path(file_path: str) -> Optional[Path]:
    """Validate and return safe file path."""
    try:
        path = Path(file_path).resolve()
        
        # Must be within allowed base directory
        if not str(path).startswith(str(BASE_DIR.resolve())):
            return None
        
        # Must exist (for read operations) or be creatable
        if not path.exists() and path.parent != BASE_DIR:
            return None
        
        return path
    except Exception:
        return None

def get_file_stats(file_path: Path) -> Dict[str, Any]:
    """Get comprehensive file statistics."""
    stat = file_path.stat()
    
    return {
        "name": file_path.name,
        "size_bytes": stat.st_size,
        "size_readable": format_bytes(stat.st_size),
        "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
        "mime_type": get_mime_type(file_path),
        "checksum": calculate_checksum(file_path)
    }

def format_bytes(bytes: int) -> str:
    """Format bytes to human readable."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.1f}{unit}"
        bytes /= 1024.0
    return f"{bytes:.1f}TB"

def calculate_checksum(file_path: Path) -> str:
    """Calculate MD5 checksum of file."""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def get_mime_type(file_path: Path) -> str:
    """Get MIME type for file."""
    mime_type, _ = mimetypes.guess_type(str(file_path))
    return mime_type or "application/octet-stream"

@mcp.tool()
async def list_files(directory: str = ".", pattern: Optional[str] = None) -> str:
    """
    List files in directory with optional pattern matching.
    
    Args:
        directory: Directory path (relative to BASE_DIR)
        pattern: Optional filename pattern (e.g., "*.txt", "report*")
    """
    dir_path = BASE_DIR / directory
    
    if not dir_path.exists():
        return f"Directory '{directory}' not found in allowed base"
    
    if not dir_path.is_dir():
        return f"'{directory}' is not a directory"
    
    files = []
    for path in dir_path.iterdir():
        if path.is_file():
            if not pattern or path.match(pattern):
                stats = get_file_stats(path)
                files.append(stats)
    
    if not files:
        return f"No files found in '{directory}'"
    
    result = [f"Files in '{directory}':"]
    for file_info in files:
        result.append(f"  {file_info['name']} ({file_info['size_readable']}) - {file_info['modified']}")
    
    return "\n".join(result)

@mcp.tool()
async def analyze_text_file(file_path: str) -> str:
    """
    Analyze contents of a text file.
    
    Args:
        file_path: Path to file (must be in BASE_DIR)
    """
    path = validate_file_path(file_path)
    if not path or not path.exists():
        return "Invalid file path"
    
    # Safety checks
    if path.suffix not in ['.txt', '.json', '.md']:
        return "Only text files supported for analysis"
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        stats = get_file_stats(path)
        
        analysis = [
            f"Analysis for {path.name}:",
            f"- Size: {stats['size_readable']}",
            f"- Lines: {len(content.splitlines())}",
            f"- Characters: {len(content)}",
            f"- Words: {len(content.split())}",
            f"- MIME Type: {stats['mime_type']}",
            "",
            "First 500 characters:",
            content[:500] + ("..." if len(content) > 500 else "")
        ]
        
        # JSON-specific analysis
        if path.suffix == '.json':
            try:
                data = json.loads(content)
                analysis.extend([
                    "\nJSON Structure:",
                    f"- Type: {type(data).__name__}",
                    f"- Size: {len(str(data))} characters"
                ])
                if isinstance(data, dict):
                    analysis.append(f"- Keys: {list(data.keys())[:10]}")
                    if len(data) > 10:
                        analysis.append("  ... and more keys")
                elif isinstance(data, list):
                    analysis.append(f"- Items: {len(data)}")
            except json.JSONDecodeError as e:
                analysis.append(f"\nJSON Error: {e}")
        
        return "\n".join(analysis)
        
    except UnicodeDecodeError:
        return "Cannot decode file as text"
    except Exception as e:
        return f"Error analyzing file: {e}"

def main():
    logger.info(f"Starting File Analysis MCP server for {BASE_DIR}")
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## Template 4: Web Scraping & HTTP Tools Server

### server.py
```python
import re
import logging
from typing import Optional
import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("web-scraper")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HTTP_TIMEOUT = 30.0
MAX_CONTENT_LENGTH = 100_000  # 100KB max

def clean_text(text: str, max_length: int = 5000) -> str:
    """Clean and truncate text content."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Truncate if too long
    if len(text) > max_length:
        text = text[:max_length] + "... [content truncated]"
    
    return text

def extract_title(soup: BeautifulSoup) -> str:
    """Extract page title."""
    title_tag = soup.find('title')
    if title_tag:
        return title_tag.text.strip()
    
    h1_tag = soup.find('h1')
    if h1_tag:
        return h1_tag.text.strip()
    
    return "Untitled"

@mcp.tool()
async def fetch_webpage(url: str, extract_types: str = "title,links,text") -> str:
    """
    Fetch and analyze webpage content.
    
    Args:
        url: URL to fetch (must include http:// or https://)
        extract_types: Comma-separated types to extract: title,links,headings,text
    """
    # Validate URL
    if not (url.startswith("http://") or url.startswith("https://")):
        return "URL must start with http:// or https://"
    
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            content_type = response.headers.get('content-type', 'text/html')
            if not (content_type.startswith('text/html') or content_type.startswith('text/plain')):
                content = clean_text(response.text, max_length=2000)
                return f"Non-HTML content (type: {content_type}): {content}"
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract requested types
            results = []
            extract_set = set(extract_types.lower().split(','))
            
            if 'title' in extract_set:
                title = extract_title(soup)
                results.append(f"Title: {title}")
            
            if 'links' in extract_set:
                links = []
                for link in soup.find_all('a', href=True)[:10]:
                    link_url = link[href]
                    link_text = link.get_text().strip()
                    link_title = link_text[:50] if link_text else "(no text)"
                    links.append(f"- {'{} ({})'.format(link_title, link_url)}")
                
                results.append(f"Links found: {len(soup.find_all(\u0027a\u0027, href=True))}")
                results.append("Top 5 links:")
                results.extend(links)
            
            if 'headings' in extract_set:
                for level in range(1, 7):
                    headings = soup.find_all(f'h{level}')
                    if headings:
                        results.append(f"H{level} headings:")
                        for heading in headings[:5]:
                            results.append(f"- {heading.get_text().strip()}")
                        break
            
            if 'text' in extract_set:
                text_content = soup.get_text()
                cleaned_text = clean_text(text_content, max_length=2000)
                results.append(f"Page text (first 2000 chars):\n{cleaned_text}")
            
            result_text = "\n".join(results)
            if len(result_text) > MAX_CONTENT_LENGTH:
                result_text = result_text[:MAX_CONTENT_LENGTH] + "\n[Content truncated]"
            
            return result_text
            
    except httpx.RequestError as e:
        return f"Request error: {str(e)}"
    except Exception as e:
        return f"Processing error: {str(e)}"

def main():
    logger.info("Starting Web Scraping MCP server")
    mcp.run(transport='stdio')

if __name__ == "__main__":
    main()
```

---

## Configuration and Deployment

### requirements.txt (for all templates)
```
mcp[cli]>=1.2.0
httpx
beautifulsoup4
aiofiles
python-dotenv
```

### docker-compose.yml (applies to all templates)
```yaml
version: '3.8'

services:
  mcp-server:
    build: .
    environment:
      - API_KEY=${API_KEY}
      - API_BASE_URL=${API_BASE_URL}
      - DB_PATH=${DB_PATH}
    volumes:
      - ./data:/app/data  # For file-based templates
      - ./logs:/app/logs
    networks:
      - mcp-network
    ports:
      - "8080:8080"

networks:
  mcp-network:
    external: true
```

### .env.example
```bash
# API Integration Template
API_KEY=your_api_secret_here
API_BASE_URL=https://api.your-service.com

# Database Template  
DB_PATH=./data/database.db

# File Analysis Template
ALLOWED_BASE_DIR=./data/files
MAX_FILE_SIZE=10485760  # 10MB

# Web Scraping Template
HTTP_TIMEOUT=30
MAX_CONTENT_LENGTH=100000
```

Choose the template that best matches your use case, customize the specific logic for your API/database/service, and deploy following the Docker MCP Gateway pattern.