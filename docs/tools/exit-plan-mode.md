---
source: Adapted from Claude Code CLI for OpenCode
name: ExitPlanMode
input_schema:
  type: object
  properties:
    plan:
      type: string
      description: The plan you came up with, that you want to run by the user for approval. Supports markdown.
  required:
    - plan
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

Use this tool when you are in plan mode and have finished presenting your plan and are ready to code. This will prompt the user to exit plan mode.

IMPORTANT: Only use this tool when the task requires planning the implementation steps of a task that requires writing code. For research tasks where you're gathering information, searching files, reading files or in general trying to understand the codebase - do NOT use this tool.
