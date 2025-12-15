---
source: Adapted from Claude Code CLI for OpenCode
name: Task
input_schema:
  type: object
  properties:
    description:
      type: string
      description: A short (3-5 word) description of the task
    prompt:
      type: string
      description: The task for the agent to perform
    subagent_type:
      type: string
      description: Type of subagent to launch
  required:
    - description
    - prompt
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

Launch a new agent that has access to the following tools: Bash, Glob, Grep, LS, exit_plan_mode, Read, Edit, MultiEdit, Write, NotebookRead, NotebookEdit, WebFetch, TodoRead, TodoWrite, WebSearch. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries, use the Agent tool to perform the search for you.

When to use the Agent tool:
- If you are searching for a keyword like "config" or "logger", or for questions like "which file does X?", the Agent tool is strongly recommended

When NOT to use the Agent tool:
- If you want to read a specific file path, use the Read or Glob tool instead
- If you are searching for a specific class definition like "class Foo", use the Glob tool instead
- If you are searching for code within a specific file or set of 2-3 files, use the Read tool instead
- Writing code and running bash commands (use other tools for that)

Usage notes:
1. Launch multiple agents concurrently whenever possible, to maximize performance
2. When the agent is done, it will return a single message back to you
3. Each agent invocation is stateless
4. Your prompt should contain a highly detailed task description for the agent to perform autonomously
