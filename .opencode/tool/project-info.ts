import { tool } from "@opencode-ai/plugin"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export const structure = tool({
  description: "Get project structure and key files",
  args: {},
  async execute(args, context) {
    const cwd = process.cwd()
    const info: string[] = []

    // Check for common project files
    const projectFiles = [
      "package.json",
      "tsconfig.json",
      "pyproject.toml",
      "Cargo.toml",
      "go.mod",
      "composer.json",
      "Gemfile",
      "pom.xml",
      "build.gradle",
    ]

    info.push("# Project Structure\n")

    for (const file of projectFiles) {
      const path = join(cwd, file)
      if (existsSync(path)) {
        try {
          const content = readFileSync(path, "utf-8")
          const parsed = JSON.parse(content)

          if (file === "package.json") {
            info.push(`## Node.js Project`)
            info.push(`Name: ${parsed.name || "N/A"}`)
            info.push(`Version: ${parsed.version || "N/A"}`)
            if (parsed.scripts) {
              info.push(`\nScripts:`)
              Object.entries(parsed.scripts).forEach(([key, value]) => {
                info.push(`  - ${key}: ${value}`)
              })
            }
          }
        } catch {
          info.push(`Found: ${file}`)
        }
      }
    }

    // Check for common directories
    const commonDirs = ["src", "lib", "app", "pages", "components", "tests", "test"]
    info.push(`\n## Directories:`)
    for (const dir of commonDirs) {
      if (existsSync(join(cwd, dir))) {
        info.push(`  - ${dir}/`)
      }
    }

    return info.join("\n")
  },
})

export const dependencies = tool({
  description: "List project dependencies",
  args: {},
  async execute() {
    const cwd = process.cwd()
    const packageJsonPath = join(cwd, "package.json")

    if (!existsSync(packageJsonPath)) {
      return "No package.json found"
    }

    try {
      const content = readFileSync(packageJsonPath, "utf-8")
      const pkg = JSON.parse(content)

      const info: string[] = ["# Dependencies\n"]

      if (pkg.dependencies) {
        info.push("## Production:")
        Object.entries(pkg.dependencies).forEach(([name, version]) => {
          info.push(`  - ${name}: ${version}`)
        })
      }

      if (pkg.devDependencies) {
        info.push("\n## Development:")
        Object.entries(pkg.devDependencies).forEach(([name, version]) => {
          info.push(`  - ${name}: ${version}`)
        })
      }

      return info.join("\n")
    } catch (error: any) {
      return `Error reading package.json: ${error.message}`
    }
  },
})
