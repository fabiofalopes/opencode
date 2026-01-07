# OpenCode Configuration Troubleshooting Guide

This guide helps diagnose and fix issues with OpenCode configuration.

## The Golden Rule
**NEVER edit `opencode.json` directly for persistent changes.**
It is a generated file. Edit `opencode.base.json` or `mcp-config/*.json` instead.

## Diagnostic Tools

### 1. Validation Script
We have a built-in validation script that checks for common errors.
```bash
npx ts-node scripts/validate-config.ts
```
**Checks performed:**
- Missing required fields in `opencode.base.json`.
- Invalid keys in MCP configurations (e.g., `description`).
- Missing `type` or `command`/`url` in MCP servers.

### 2. Build Script
If `opencode.json` is out of sync or missing MCPs:
```bash
npx ts-node scripts/manage-mcp.ts build
```

### 3. Agent Validation Script
Validates YAML frontmatter in agent `.md` files:
```bash
npm run validate:agents
```
**Checks performed:**
- Required `description` field present
- `tools` field is Record<string, boolean>, not an array
- `mode` uses valid values (primary, subagent, all)
- `temperature` is between 0 and 1

## Common Issues & Solutions

### Error: "Unknown key 'description'"
**Cause:** You added a `description` field to an MCP server config. OpenCode's schema does not support this.
**Fix:** Remove the `description` field. Use comments `//` if you need to document it (in JSONC files).

### Error: Changes to `opencode.json` disappeared
**Cause:** You edited `opencode.json` directly, and the build script overwrote it.
**Fix:** Apply your changes to `opencode.base.json` (for agents/models) or `mcp-config/*.json` (for MCPs), then run the build script.

### Error: OpenCode fails to start after config change
**Cause:** Invalid JSON or schema violation.
**Fix:**
1. Run `npx ts-node scripts/validate-config.ts`.
2. If that passes, check `opencode.json` for syntax errors.
3. Restore from backup if available.

### Error: New MCP server not showing up
**Cause:** You added the file to `mcp-config/` but didn't run the build script.
**Fix:** Run `npx ts-node scripts/manage-mcp.ts build`.

### Error: "expected record, received array tools"
**Cause:** The `tools` field in an agent `.md` file was declared as an array instead of a key-value record.
**Fix:**
```yaml
# ❌ WRONG
tools:
  - write
  - edit

# ✅ CORRECT
tools:
  write: true
  edit: true
```
Run `npm run validate:agents` to find all affected files.
See: `docs/AGENT_MD_SCHEMA.md` for full specification.

## Configuration Hierarchy

1. **Global Config**: `~/.config/opencode/opencode.json` (Generated)
   - Source: `opencode.base.json` + `mcp-config/*.json`
2. **Project Config**: `./.opencode/opencode.json` (Overrides Global)
3. **Environment**: `OPENCODE_CONFIG` variable (Overrides all)

## Best Practices

- **Always Validate**: Run the validation script before committing changes.
- **Use the Config Manager**: The `opencode-config-manager` agent knows these rules and can safely make changes for you.
  ```
  @opencode-config-manager Add the 'brave' MCP server to research.json
  ```
