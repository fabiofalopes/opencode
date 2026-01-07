# MCP Tools Reference

This document describes all available MCP (Model Context Protocol) tools and how to use them effectively.

## Overview

MCP tools extend the agent's capabilities through external servers. All MCP tools are prefixed with `mcp_` followed by the server name and tool name.

**Total: 11 enabled MCP servers with 50+ tools**

## Research & Information Tools

### context7 - Library Documentation

Get documentation for popular libraries and frameworks.

**Tools:**
- `mcp_context7_resolve_library_id(libraryName)` - Find library ID
- `mcp_context7_get_library_docs(context7CompatibleLibraryID, topic?, tokens?)` - Get docs

**Supported Libraries:**
- `/vercel/next.js` - Next.js
- `/facebook/react` - React
- `/mongodb/docs` - MongoDB
- `/fastapi/fastapi` - FastAPI
- `/vuejs/core` - Vue.js
- And many more...

**Examples:**
```python
# Get Next.js routing docs
mcp_context7_get_library_docs(
    context7CompatibleLibraryID="/vercel/next.js",
    topic="routing",
    tokens=5000
)

# Find library ID
mcp_context7_resolve_library_id(libraryName="FastAPI")
```

### wikipedia - Wikipedia Access

Search and retrieve Wikipedia content.

**Tools:**
- `mcp_wikipedia_search_wikipedia(query, limit=10)` - Search articles
- `mcp_wikipedia_get_article(title)` - Get full article
- `mcp_wikipedia_get_summary(title)` - Get summary
- `mcp_wikipedia_extract_key_facts(title, count=5)` - Extract facts
- `mcp_wikipedia_get_related_topics(title, limit=10)` - Related topics

**Examples:**
```python
# Search for articles
mcp_wikipedia_search_wikipedia(query="machine learning", limit=5)

# Get article summary
mcp_wikipedia_get_summary(title="Python (programming language)")

# Extract key facts
mcp_wikipedia_extract_key_facts(title="Artificial intelligence", count=10)
```

### duckduckgo - Web Search

Search the web using DuckDuckGo.

**Tools:**
- `mcp_duckduckgo_search(query, max_results=10)` - Search web
- `mcp_duckduckgo_fetch_content(url)` - Fetch and parse webpage

**Examples:**
```python
# Search for tutorials
mcp_duckduckgo_search(
    query="FastAPI authentication tutorial",
    max_results=10
)

# Fetch webpage content
mcp_duckduckgo_fetch_content(url="https://fastapi.tiangolo.com")
```

### fetch - Web Content Fetcher

Fetch and parse web content as markdown.

**Tools:**
- `mcp_fetch_fetch(url, max_length=5000, start_index=0, raw=false)` - Fetch URL

**Examples:**
```python
# Fetch documentation
mcp_fetch_fetch(url="https://docs.python.org/3/library/asyncio.html")

# Fetch raw HTML
mcp_fetch_fetch(url="https://example.com", raw=true)

# Fetch with pagination
mcp_fetch_fetch(url="https://example.com", start_index=5000, max_length=5000)
```

### gh_grep - GitHub Search

Search code across GitHub repositories.

**Tools:**
- `mcp_gh_grep_search(query, repo?, language?, path?)` - Search GitHub code

**Examples:**
```python
# Search for FastAPI examples
mcp_gh_grep_search(
    query="FastAPI authentication",
    language="python"
)

# Search in specific repo
mcp_gh_grep_search(
    query="async def",
    repo="tiangolo/fastapi"
)
```

### arxiv - Research Papers

Search and download arXiv papers.

**Tools:**
- `mcp_arxiv_search_papers(query, categories?, max_results=10, date_from?, date_to?)` - Search papers
- `mcp_arxiv_download_paper(paper_id)` - Download paper as markdown
- `mcp_arxiv_read_paper(paper_id)` - Read downloaded paper
- `mcp_arxiv_list_papers()` - List downloaded papers

**Categories:**
- `cs.AI` - Artificial Intelligence
- `cs.LG` - Machine Learning
- `cs.CL` - Computation and Language
- `cs.CV` - Computer Vision
- `cs.RO` - Robotics

**Examples:**
```python
# Search for ML papers
mcp_arxiv_search_papers(
    query="transformer architecture",
    categories=["cs.AI", "cs.LG"],
    max_results=10,
    date_from="2023-01-01"
)

# Download and read paper
mcp_arxiv_download_paper(paper_id="2301.07041")
mcp_arxiv_read_paper(paper_id="2301.07041")
```

### hackernews - Hacker News

Access Hacker News stories, comments, and discussions.

**Tools:**
- `mcp_hackernews_get_top_stories(limit?)` - Get top stories
- `mcp_hackernews_get_story(id)` - Get specific story
- `mcp_hackernews_search_stories(query, limit?)` - Search stories
- `mcp_hackernews_get_user(username)` - Get user info

**Examples:**
```python
# Get top stories
mcp_hackernews_get_top_stories(limit=10)

# Get specific story
mcp_hackernews_get_story(id=12345678)

# Search stories
mcp_hackernews_search_stories(query="AI agents", limit=20)

# Get user info
mcp_hackernews_get_user(username="pg")
```

### paper_search - Multi-Source Papers

Search papers from multiple sources (arXiv, PubMed, bioRxiv, etc.).

**Tools:**
- `mcp_paper_search_search_arxiv(query, max_results=10)` - Search arXiv
- `mcp_paper_search_search_pubmed(query, max_results=10)` - Search PubMed
- `mcp_paper_search_search_semantic(query, year?, max_results=10)` - Semantic Scholar
- `mcp_paper_search_download_arxiv(paper_id, save_path)` - Download paper
- `mcp_paper_search_read_arxiv_paper(paper_id, save_path)` - Read paper

**Examples:**
```python
# Search multiple sources
mcp_paper_search_search_arxiv(query="neural networks", max_results=10)
mcp_paper_search_search_semantic(query="deep learning", year="2023-2024")
```

## Development Tools

### code_interpreter - Python Execution

Execute Python code in an isolated environment.

**Tools:**
- `mcp_code_interpreter_execute_code(code, session_id=0)` - Execute Python code

**Features:**
- Persistent sessions (variables retained)
- NumPy, Pandas, Matplotlib available
- File system access in workspace
- Returns output and errors

**Examples:**
```python
# Simple calculation
mcp_code_interpreter_execute_code(
    code="import numpy as np\nprint(np.array([1,2,3]).mean())"
)

# Data analysis
mcp_code_interpreter_execute_code(
    code="""
import pandas as pd
df = pd.read_csv('data.csv')
print(df.describe())
""",
    session_id=1
)

# Continue in same session
mcp_code_interpreter_execute_code(
    code="print(df.head())",
    session_id=1
)
```

### github - GitHub API

Interact with GitHub (requires authentication).

**Tools:**
- `mcp_github_create_issue(repo, title, body)` - Create issue
- `mcp_github_create_pull_request(repo, title, body, head, base)` - Create PR
- `mcp_github_list_issues(repo, state?)` - List issues
- And more...

**Note:** Requires `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.

## Cognitive Tools

### sequential_thinking - Structured Reasoning

Chain-of-thought problem solving with revision capability.

**Tools:**
- `mcp_sequential_thinking_sequentialthinking(thought, thoughtNumber, totalThoughts, nextThoughtNeeded, isRevision?, revisesThought?, branchFromThought?, branchId?, needsMoreThoughts?)` - Think step by step

**Features:**
- Adjustable thought count
- Revision of previous thoughts
- Branching logic
- Hypothesis generation and verification

**Examples:**
```python
# Start thinking process
mcp_sequential_thinking_sequentialthinking(
    thought="First, I need to understand the authentication requirements...",
    thoughtNumber=1,
    totalThoughts=5,
    nextThoughtNeeded=true
)

# Continue thinking
mcp_sequential_thinking_sequentialthinking(
    thought="Based on the requirements, I'll use JWT tokens...",
    thoughtNumber=2,
    totalThoughts=5,
    nextThoughtNeeded=true
)

# Revise previous thought
mcp_sequential_thinking_sequentialthinking(
    thought="Actually, OAuth2 would be better because...",
    thoughtNumber=3,
    totalThoughts=5,
    nextThoughtNeeded=true,
    isRevision=true,
    revisesThought=2
)
```

### memory - Knowledge Graph

Persistent storage of entities, relations, and observations.

**Tools:**
- `mcp_memory_create_entities(entities)` - Create entities
- `mcp_memory_create_relations(relations)` - Create relations
- `mcp_memory_add_observations(observations)` - Add observations
- `mcp_memory_search_nodes(query)` - Search knowledge graph
- `mcp_memory_open_nodes(names)` - Get specific nodes
- `mcp_memory_read_graph()` - Read entire graph
- `mcp_memory_delete_entities(entityNames)` - Delete entities

**Examples:**
```python
# Create project entity
mcp_memory_create_entities(entities=[{
    "name": "FastAPI Auth Project",
    "entityType": "project",
    "observations": [
        "Uses FastAPI framework",
        "PostgreSQL database",
        "JWT authentication",
        "Started 2024-11-01"
    ]
}])

# Create relations
mcp_memory_create_relations(relations=[{
    "from": "FastAPI Auth Project",
    "to": "PostgreSQL",
    "relationType": "uses"
}])

# Search knowledge
mcp_memory_search_nodes(query="authentication")

# Add observations
mcp_memory_add_observations(observations=[{
    "entityName": "FastAPI Auth Project",
    "contents": [
        "Added OAuth2 support",
        "Implemented refresh tokens"
    ]
}])
```

## Content Tools

### obsidian - Obsidian Vault

Access Obsidian vault (requires setup and API key).

**Tools:**
- `mcp_obsidian_obsidian_list_files_in_vault()` - List vault files
- `mcp_obsidian_obsidian_get_file_contents(filepath)` - Read file
- `mcp_obsidian_obsidian_simple_search(query)` - Search vault
- `mcp_obsidian_obsidian_append_content(filepath, content)` - Append to file
- And more...

**Note:** Requires Obsidian Local REST API plugin and configuration.

## Best Practices

### When to Use MCP vs Built-in Tools

**Use MCP tools when:**
- Need specialized capabilities (documentation, papers, execution)
- Require persistent storage (memory)
- Need structured reasoning (sequential thinking)
- Want to search external sources (GitHub, Wikipedia, arXiv)

**Use built-in tools when:**
- Working with local files (Read, Write, Edit)
- Running shell commands (Bash)
- Searching local codebase (Grep, Glob)
- Managing tasks (TodoWrite)

### Combining Tools

MCP tools work great with built-in tools:

```python
# Research then implement
1. mcp_context7_get_library_docs() - Get FastAPI docs
2. mcp_arxiv_search_papers() - Find authentication papers
3. Write() - Create implementation
4. Bash() - Run tests

# Learn and remember
1. mcp_wikipedia_search_wikipedia() - Research topic
2. mcp_memory_create_entities() - Store knowledge
3. mcp_sequential_thinking() - Reason about application
4. Edit() - Apply changes

# Search and analyze
1. mcp_duckduckgo_search() - Find resources
2. mcp_fetch_fetch() - Get content
3. mcp_code_interpreter_execute_code() - Analyze data
4. TodoWrite() - Track findings
```

### Error Handling

MCP tools may fail due to:
- Network issues
- API rate limits
- Missing authentication
- Server timeouts

Always check tool responses and have fallback strategies.

## Configuration

MCP servers are configured in `opencode.json`:

```json
{
  "mcp": {
    "server_name": {
      "type": "local",
      "command": ["docker", "run", "-i", "--rm", "mcp/server"],
      "enabled": true,
      "timeout": 10000,
      "environment": {
        "API_KEY": "{env:API_KEY}"
      }
    }
  }
}
```

Agent profiles control which tools are available:

```json
{
  "agent": {
    "default": {
      "tools": {
        "context7": true,
        "wikipedia": true,
        "duckduckgo": true
      }
    }
  }
}
```

## Troubleshooting

**Server not responding:**
- Check `opencode.json` configuration
- Verify Docker is running (for Docker-based servers)
- Check environment variables
- Increase timeout value

**Authentication errors:**
- Set required environment variables
- Check API key validity
- Verify permissions

**Tool not available:**
- Check agent profile configuration
- Verify server is enabled
- Restart OpenCode

## Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [OpenCode MCP Documentation](https://opencode.ai/docs/mcp)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
