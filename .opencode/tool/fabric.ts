import { tool } from "@opencode-ai/plugin"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export default tool({
  description: "Execute Fabric AI patterns for content processing and analysis",
  args: {
    pattern: tool.schema
      .string()
      .describe(
        "Fabric pattern to use (e.g., extract_wisdom, summarize, create_coding_project)"
      ),
    input: tool.schema.string().describe("Input text/content to process"),
    model: tool.schema
      .string()
      .optional()
      .describe("Optional model to use (defaults to configured model)"),
  },
  async execute(args) {
    try {
      // Check if fabric is installed
      try {
        await execAsync("which fabric")
      } catch {
        return "Error: Fabric is not installed. Install with: pip install fabric-ai"
      }

      // Build command
      const cmd = args.model
        ? `echo ${JSON.stringify(args.input)} | fabric --pattern ${args.pattern} --model ${args.model}`
        : `echo ${JSON.stringify(args.input)} | fabric --pattern ${args.pattern}`

      // Execute fabric
      const { stdout, stderr } = await execAsync(cmd, {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      })

      if (stderr && !stdout) {
        return `Error: ${stderr}`
      }

      return stdout || "No output from Fabric"
    } catch (error: any) {
      return `Error executing Fabric: ${error.message}`
    }
  },
})
