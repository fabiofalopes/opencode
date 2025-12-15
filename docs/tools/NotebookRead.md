---
source: Adapted from Claude Code CLI for OpenCode
name: NotebookRead
input_schema:
  type: object
  properties:
    notebook_path:
      type: string
      description: "The absolute path to the Jupyter notebook file to read"
    cell_id:
      type: string
      description: "The ID of a specific cell to read. If not provided, all cells will be read."
  required:
    - notebook_path
  additionalProperties: false
  $schema: "http://json-schema.org/draft-07/schema#"
---

Reads a Jupyter notebook (.ipynb file) and returns all of the cells with their outputs. The notebook_path parameter must be an absolute path, not a relative path.
