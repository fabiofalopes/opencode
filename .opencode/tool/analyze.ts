import { tool } from "@opencode-ai/plugin"
import { readFileSync, statSync } from "fs"
import { join } from "path"

export default tool({
  description: "Analyze code file for complexity, size, and basic metrics",
  args: {
    file: tool.schema.string().describe("Path to file to analyze"),
  },
  async execute(args) {
    try {
      const filePath = join(process.cwd(), args.file)
      const content = readFileSync(filePath, "utf-8")
      const stats = statSync(filePath)

      const lines = content.split("\n")
      const nonEmptyLines = lines.filter((l) => l.trim().length > 0)
      const commentLines = lines.filter(
        (l) => l.trim().startsWith("//") || l.trim().startsWith("#")
      )

      // Basic complexity metrics
      const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || [])
        .length
      const classes = (content.match(/class\s+\w+/g) || []).length
      const imports = (content.match(/^import\s+/gm) || []).length
      const exports = (content.match(/^export\s+/gm) || []).length

      const info = [
        `# Analysis: ${args.file}\n`,
        `## Size`,
        `- Total lines: ${lines.length}`,
        `- Non-empty lines: ${nonEmptyLines.length}`,
        `- Comment lines: ${commentLines.length}`,
        `- File size: ${(stats.size / 1024).toFixed(2)} KB`,
        `\n## Structure`,
        `- Functions: ${functions}`,
        `- Classes: ${classes}`,
        `- Imports: ${imports}`,
        `- Exports: ${exports}`,
        `\n## Complexity Indicators`,
        `- Avg line length: ${Math.round(content.length / lines.length)} chars`,
        `- Code density: ${Math.round((nonEmptyLines.length / lines.length) * 100)}%`,
      ]

      return info.join("\n")
    } catch (error: any) {
      return `Error analyzing file: ${error.message}`
    }
  },
})
