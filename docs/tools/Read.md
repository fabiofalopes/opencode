---
source: Adapted from Claude Code CLI for OpenCode
name: Read
input_schema:
  type: object
  properties:
    file_path:
      type: string
      description: The absolute path to the file to read
    offset:
      type: number
      description: The line number to start reading from. Only provide if the file is too large to read at once
    limit:
      type: number
      description: The number of lines to read. Only provide if the file is too large to read at once.
  required:
    - file_path
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

Reads a file from the local filesystem. You can access any file directly by using this tool.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to 2000 lines starting from the beginning of the file
- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters
- Any lines longer than 2000 characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows reading images (eg PNG, JPG, etc). When reading an image file the contents are presented visually.
- This tool can read PDF files (.pdf). PDFs are processed page by page, extracting both text and visual content for analysis.
- For Jupyter notebooks (.ipynb files), use the NotebookRead instead
- You have the capability to call multiple tools in a single response. It is always better to speculatively read multiple files as a batch that are potentially useful.
