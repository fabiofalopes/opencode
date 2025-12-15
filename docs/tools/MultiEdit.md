---
source: Adapted from Claude Code CLI for OpenCode
name: MultiEdit
input_schema:
  type: object
  properties:
    file_path:
      type: string
      description: The absolute path to the file to modify
    edits:
      type: array
      items:
        type: object
        properties:
          old_string:
            type: string
            description: The text to replace
          new_string:
            type: string
            description: The text to replace it with
          replace_all:
            type: boolean
            default: false
            description: Replace all occurences of old_string (default false).
        required:
          - old_string
          - new_string
        additionalProperties: false
      minItems: 1
      description: Array of edit operations to perform sequentially on the file
  required:
    - file_path
    - edits
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

This is a tool for making multiple edits to a single file in one operation. It is built on top of the Edit tool and allows you to perform multiple find-and-replace operations efficiently. Prefer this tool over the Edit tool when you need to make multiple edits to the same file.

Before using this tool:
1. Use the Read tool to understand the file's contents and context
2. Verify the directory path is correct

To make multiple file edits, provide:
1. file_path: The absolute path to the file to modify
2. edits: An array of edit operations to perform

IMPORTANT:
- All edits are applied in sequence, in the order they are provided
- Each edit operates on the result of the previous edit
- All edits must be valid for the operation to succeed - if any edit fails, none will be applied
- This tool is ideal when you need to make several changes to different parts of the same file
- For Jupyter notebooks (.ipynb files), use the NotebookEdit instead

CRITICAL REQUIREMENTS:
1. All edits follow the same requirements as the single Edit tool
2. The edits are atomic - either all succeed or none are applied
3. Plan your edits carefully to avoid conflicts between sequential operations
