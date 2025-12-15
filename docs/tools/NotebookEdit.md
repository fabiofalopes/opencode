---
source: Adapted from Claude Code CLI for OpenCode
name: NotebookEdit
input_schema:
  type: object
  properties:
    notebook_path:
      type: string
      description: "The absolute path to the Jupyter notebook file to edit"
    new_source:
      type: string
      description: "The new source for the cell"
    edit_mode:
      type: string
      enum:
        - replace
        - insert
        - delete
      description: "The type of edit to make (replace, insert, delete). Defaults to replace."
    cell_id:
      type: string
      description: "The ID of the cell to edit."
    cell_type:
      type: string
      enum:
        - code
        - markdown
      description: "The type of the cell (code or markdown)."
  required:
    - notebook_path
    - new_source
  additionalProperties: false
  $schema: "http://json-schema.org/draft-07/schema#"
---

Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. The notebook_path parameter must be an absolute path, not a relative path. Use edit_mode=insert to add a new cell. Use edit_mode=delete to delete a cell.
