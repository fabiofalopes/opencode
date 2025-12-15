import { tool } from "@opencode-ai/plugin"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export const status = tool({
  description: "Get detailed git status including branch, changes, and recent commits",
  args: {},
  async execute() {
    try {
      // Check if git repo
      try {
        await execAsync("git rev-parse --git-dir")
      } catch {
        return "Not a git repository"
      }

      const info: string[] = ["# Git Status\n"]

      // Current branch
      const { stdout: branch } = await execAsync("git branch --show-current")
      info.push(`Branch: ${branch.trim()}`)

      // Remote tracking
      try {
        const { stdout: remote } = await execAsync(
          "git rev-parse --abbrev-ref --symbolic-full-name @{u}"
        )
        info.push(`Tracking: ${remote.trim()}`)
      } catch {
        info.push("Tracking: No remote branch")
      }

      // Status
      const { stdout: status } = await execAsync("git status --short")
      if (status.trim()) {
        info.push("\n## Changes:")
        info.push(status.trim())
      } else {
        info.push("\n## Changes: Clean working directory")
      }

      // Recent commits
      const { stdout: commits } = await execAsync(
        'git log --oneline -5 --pretty=format:"%h %s"'
      )
      info.push("\n## Recent Commits:")
      info.push(commits.trim())

      return info.join("\n")
    } catch (error: any) {
      return `Error: ${error.message}`
    }
  },
})

export const diff = tool({
  description: "Get git diff for staged or unstaged changes",
  args: {
    staged: tool.schema
      .boolean()
      .optional()
      .describe("Show staged changes (default: false)"),
  },
  async execute(args) {
    try {
      const cmd = args.staged ? "git diff --cached" : "git diff"
      const { stdout } = await execAsync(cmd)

      if (!stdout.trim()) {
        return args.staged ? "No staged changes" : "No unstaged changes"
      }

      return stdout
    } catch (error: any) {
      return `Error: ${error.message}`
    }
  },
})
