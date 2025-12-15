---
source: Adapted from Claude Code CLI for OpenCode
name: Bash
input_schema:
  type: object
  properties:
    command:
      type: string
      description: The command to execute
    description:
      type: string
      description: "Clear, concise description of what this command does in 5-10 words."
    timeout:
      type: number
      description: Optional timeout in milliseconds (max 600000)
  required:
    - command
  additionalProperties: false
  $schema: http://json-schema.org/draft-07/schema#
---

Executes a given bash command in a persistent shell session with optional timeout, ensuring proper handling and security measures.

Before executing the command, please follow these steps:

1. Directory Verification:
   - If the command will create new directories or files, first use the LS tool to verify the parent directory exists and is the correct location

2. Command Execution:
   - Always quote file paths that contain spaces with double quotes (e.g., cd "path with spaces/file.txt")
   - After ensuring proper quoting, execute the command.
   - Capture the output of the command.

Usage notes:
  - The command argument is required.
  - You can specify an optional timeout in milliseconds (up to 600000ms / 10 minutes). If not specified, commands will timeout after 120000ms (2 minutes).
  - It is very helpful if you write a clear, concise description of what this command does in 5-10 words.
  - If the output exceeds 30000 characters, output will be truncated before being returned to you.
  - VERY IMPORTANT: You MUST avoid using search commands like `find` and `grep`. Instead use Grep, Glob, or Task to search. You MUST avoid read tools like `cat`, `head`, `tail`, and `ls`, and use Read and LS to read files.
  - If you _still_ need to run `grep`, STOP. ALWAYS USE ripgrep at `rg` first.
  - When issuing multiple commands, use the ';' or '&&' operator to separate them. DO NOT use newlines (newlines are ok in quoted strings).
  - Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of `cd`.

# Committing changes with git

When the user asks you to create a new git commit, follow these steps carefully:

1. Run the following bash commands in parallel:
  - Run a git status command to see all untracked files.
  - Run a git diff command to see both staged and unstaged changes that will be committed.
  - Run a git log command to see recent commit messages, so that you can follow this repository's commit message style.
2. Analyze all staged changes and draft a commit message
3. Run the following commands in parallel:
   - Add relevant untracked files to the staging area.
   - Create the commit with a message.
   - Run git status to make sure the commit succeeded.

Important notes:
- NEVER update the git config
- DO NOT push to the remote repository unless the user explicitly asks you to do so
- IMPORTANT: Never use git commands with the -i flag (like git rebase -i or git add -i) since they require interactive input which is not supported.
- In order to ensure good formatting, ALWAYS pass the commit message via a HEREDOC

# Creating pull requests
Use the gh command via the Bash tool for ALL GitHub-related tasks including working with issues, pull requests, checks, and releases.

IMPORTANT: When the user asks you to create a pull request, follow these steps carefully:

1. Run the following bash commands in parallel:
   - Run a git status command to see all untracked files
   - Run a git diff command to see both staged and unstaged changes
   - Check if the current branch tracks a remote branch
   - Run a git log command and `git diff [base-branch]...HEAD`
2. Analyze all changes that will be included in the pull request
3. Run the following commands in parallel:
   - Create new branch if needed
   - Push to remote with -u flag if needed
   - Create PR using gh pr create

Important:
- NEVER update the git config
- DO NOT use the TodoWrite or Task tools
- Return the PR URL when you're done
