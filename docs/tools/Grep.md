---
source: Adapted from Claude Code CLI for OpenCode
name: Grep
input_schema:
  type: object
  properties:
    pattern:
      type: string
      description: The regular expression pattern to search for in file contents
    path:
      type: string
      description: File or directory to search in (rg PATH). Defaults to current working directory.
    glob:
      type: string
      description: Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob
    type:
      type: string
      description: "File type to search (rg --type). Common types: js, py, rust, go, java, etc."
    output_mode:
      type: string
      description: "Output mode - content shows matching lines, files_with_matches shows file paths, count shows match counts. Defaults to files_with_matches."
      enum:
        - content
        - files_with_matches
        - count
    case_insensitive:
      type: boolean
      description: "Case insensitive search (rg -i)"
    show_line_numbers:
      type: boolean
      description: "Show line numbers in output (rg -n). Requires output_mode content."
    lines_after:
      type: number
      description: "Number of lines to show after each match (rg -A). Requires output_mode content."
    lines_before:
      type: number
      description: "Number of lines to show before each match (rg -B). Requires output_mode content."
    lines_context:
      type: number
      description: "Number of lines to show before and after each match (rg -C). Requires output_mode content."
    multiline:
      type: boolean
      description: "Enable multiline mode where . matches newlines (rg -U --multiline-dotall). Default false."
    head_limit:
      type: number
      description: "Limit output to first N lines/entries, equivalent to pipe head -N."
  required:
    - pattern
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

A powerful search tool built on ripgrep

Usage:
- ALWAYS use Grep for search tasks. NEVER invoke `grep` or `rg` as a Bash command.
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
- Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
- Use Task tool for open-ended searches requiring multiple rounds
- Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping
- Multiline matching: By default patterns match within single lines only. For cross-line patterns, use `multiline: true`
