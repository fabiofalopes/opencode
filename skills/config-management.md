---
name: config-management
description: Safe workflow for maintaining the OpenCode configuration stack
---

# Config Management Skill (CONFIG_INTELLIGENCE · Phase 2)

## Core Concepts
- `opencode.base.json` is the canonical source for global settings and shared defaults—treat it as the single source of truth.
- `mcp-config/*.json` stores modular MCP server definitions; enable/disable or tweak servers here without touching the base file.
- `opencode.json` is a generated artifact created by the build pipeline; never edit it manually because any change will be overwritten on the next build.
- `profiles.json` controls model/provider profiles (Zens, Gemini, Copilot, Grok) and feeds the switch scripts; adjust model routing here.

## Key Commands
| Command | Purpose |
|---------|---------|
| `npx ts-node scripts/manage-mcp.ts build` | Rebuilds `opencode.json` from `opencode.base.json`, `mcp-config/`, and `profiles.json`. |
| `npx ts-node scripts/validate-config.ts` | Lints and validates MCP configuration modules before building. |
| `npm run validate:agents` | Ensures every file in `.opencode/agent/` or `agent/` matches the YAML schema. |
| `npm run switch:zens|gemini|copilot|grok` | Applies the corresponding model profile (updates generated config). |

## Safe Modification Workflow
1. **Backup**
   - Copy the files you are about to touch (e.g., `cp opencode.base.json opencode.base.json.bak`).
   - Commit or archive the current state before major edits.
2. **Modify With Intent**
   - Edit only the relevant source files (`opencode.base.json`, `mcp-config/*.json`, `profiles.json`, agent Markdown).
   - Keep changes scoped and documented.
3. **Validate**
   - Run `npx ts-node scripts/validate-config.ts` for MCP changes.
   - Run `npm run validate:agents` after editing agent definitions.
4. **Build**
   - Execute `npx ts-node scripts/manage-mcp.ts build` to regenerate `opencode.json`.
5. **Test**
   - Launch OpenCode or targeted commands to ensure the new config loads without errors.
   - Re-run any affected workflows (e.g., MCP server startup) to confirm behavior.

## Common Pitfalls
- Editing `opencode.json` directly; rebuilds will discard the changes.
- Adding a `description` field inside MCP config JSON files; the loader rejects it and crashes.
- Defining `tools:` as an array in agent frontmatter; it must be a key/value map (`tools: { write: true }`).
- Forgetting to run the build after editing profiles or MCP modules, leaving OpenCode with stale settings.

## File Locations
- **Config root**: `~/.config/opencode/`
- **Agent definitions**: `~/.config/opencode/agent/` or `.opencode/agent/`
- **MCP modules**: `~/.config/opencode/mcp-config/`
- **Scripts**: `~/.config/opencode/scripts/`

## When to Load This Skill
- Prior to modifying any OpenCode configuration or profile.
- While diagnosing configuration or MCP load errors.
- When adding, removing, or updating MCP servers or model profiles.
