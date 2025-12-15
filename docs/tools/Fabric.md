---
source: OpenCode Agent - Fabric Integration
name: Fabric
input_schema:
  type: object
  properties:
    pattern:
      type: string
      description: The fabric pattern to use (e.g., extract_wisdom, summarize, create_coding_project)
    input:
      type: string
      description: The input text/content to process with the pattern
    model:
      type: string
      description: Optional model to use (defaults to configured model)
    stream:
      type: boolean
      default: false
      description: Stream the output (default false)
  required:
    - pattern
    - input
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

Executes Fabric AI patterns for content processing and analysis.

Fabric is an open-source framework for augmenting humans using AI. It provides a modular framework based on the UNIX philosophy to break down problems into components and apply AI to them.

## What is Fabric?

Fabric helps you:
- Extract wisdom from content (videos, articles, podcasts)
- Summarize and analyze text
- Create structured outputs from unstructured data
- Generate code, documentation, and more
- Process content through specialized AI patterns

## Usage

Basic command structure:
```bash
echo "content" | fabric --pattern <pattern_name>
```

With files:
```bash
fabric --pattern extract_wisdom < article.txt
cat document.md | fabric --pattern summarize
```

With URLs (using yt for YouTube):
```bash
yt https://youtube.com/watch?v=VIDEO_ID | fabric --pattern extract_wisdom
```

## Common Patterns

### Content Analysis
- `extract_wisdom` - Extract key insights, quotes, and wisdom from content
- `summarize` - Create concise summaries
- `extract_article_wisdom` - Specialized for articles
- `analyze_claims` - Analyze and fact-check claims
- `extract_insights` - Pull out key insights

### Code & Development
- `create_coding_project` - Generate project structure and code
- `explain_code` - Explain code functionality
- `improve_code` - Suggest code improvements
- `create_pattern` - Create new Fabric patterns
- `write_pull-request` - Generate PR descriptions

### Writing & Communication
- `improve_writing` - Enhance writing quality
- `create_summary` - Generate summaries
- `write_essay` - Draft essays
- `create_keynote` - Create presentation outlines

### Security & Analysis
- `analyze_threat_report` - Analyze security threats
- `create_security_update` - Generate security updates
- `analyze_malware` - Malware analysis

## Installation

```bash
# Install fabric
pip install fabric-ai

# Or with pipx
pipx install fabric-ai

# Setup (creates ~/.config/fabric)
fabric --setup

# Update patterns
fabric --update
```

## Configuration

Fabric stores configuration in `~/.config/fabric/`:
- `.env` - API keys and model configuration
- `patterns/` - Available patterns
- `custom-patterns/` - Your custom patterns

## Examples

Extract wisdom from a video:
```bash
yt https://youtube.com/watch?v=abc123 | fabric --pattern extract_wisdom
```

Summarize a document:
```bash
cat README.md | fabric --pattern summarize
```

Create a coding project:
```bash
echo "Build a REST API for todo management" | fabric --pattern create_coding_project
```

Analyze code:
```bash
cat main.py | fabric --pattern explain_code
```

## Integration with OpenCode Agent

This tool allows the agent to:
1. Process content through Fabric patterns
2. Extract structured information from unstructured data
3. Generate code and documentation
4. Analyze and summarize content
5. Apply specialized AI patterns to solve specific problems

## Usage Notes

- Fabric requires API keys for LLM providers (OpenAI, Anthropic, etc.)
- Patterns are stored in `~/.config/fabric/patterns/`
- You can create custom patterns for specific use cases
- Use `fabric --list` to see all available patterns
- Use `fabric --pattern <name> --help` for pattern-specific help

## Common Workflows

**Content Research:**
```bash
# Download and analyze
yt VIDEO_URL | fabric --pattern extract_wisdom > insights.md
```

**Code Generation:**
```bash
# Generate project structure
echo "Create a FastAPI app with auth" | fabric --pattern create_coding_project
```

**Documentation:**
```bash
# Generate docs from code
cat src/*.py | fabric --pattern create_documentation
```

**Analysis Pipeline:**
```bash
# Multi-stage processing
cat article.txt | fabric --pattern extract_wisdom | fabric --pattern summarize
```
