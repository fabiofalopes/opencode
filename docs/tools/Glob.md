---
source: Adapted from Claude Code CLI for OpenCode
name: Glob
input_schema:
  type: object
  properties:
    pattern:
      type: string
      description: The glob pattern to match files against
    path:
      type: string
      description: The directory to search in. If not specified, the current working directory will be used.
  required:
    - pattern
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
- You have the capability to call multiple tools in a single response. It is always better to speculatively perform multiple searches as a batch that are potentially useful.
