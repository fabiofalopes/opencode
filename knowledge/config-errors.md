# Configuration Error Patterns

This file documents known error patterns and their root causes.

## YAML Structure Errors

### tools-array-instead-of-record
- **Error:** `Invalid input: expected record, received array tools`
- **Cause:** tools field defined as YAML array instead of object
- **Bad:**
  ```yaml
  tools:
    - write
    - edit
  ```
- **Good:**
  ```yaml
  tools:
    write: true
    edit: true
  ```

### missing-required-field
- **Error:** `description is required`
- **Cause:** Agent frontmatter missing required description field

### array-converted-to-object (CRITICAL)
- **Error:** `Invalid input: expected array, received object`
- **Cause:** JSON manipulation that converts arrays to objects with numeric keys
- **Affected Fields:** `plugin`, `instructions`, `modalities.input`, `modalities.output`
- **Bad:**
  ```json
  "plugin": {"0": "opencode-google-antigravity-auth"}
  "modalities": {"input": {"0": "text", "1": "image"}}
  ```
- **Good:**
  ```json
  "plugin": ["opencode-google-antigravity-auth"]
  "modalities": {"input": ["text", "image"]}
  ```
- **Root Cause:** Some JSON parsing/stringify operations or manual edits convert `[]` arrays to `{}` objects with index keys
- **Prevention:** 
  1. NEVER edit `opencode.json` directly - use `init-machine.ts` to regenerate from template
  2. If editing template, verify arrays remain arrays after save
  3. Always run `npx ts-node scripts/validate-config.ts` after ANY config change
- **Recovery:** Run `npx ts-node scripts/init-machine.ts` to regenerate from template

## Path Errors

### linux-paths-on-macos
- **Error:** MCP server fails to mount volume
- **Cause:** Linux paths (`/home/`) used on macOS (`/Users/`)
- **Symptoms:** Memory MCP, code_interpreter fail silently
- **Detection:** Check opencode.json for `/home/` on darwin platform

### missing-mcp-directories
- **Error:** Container volume mount fails
- **Cause:** Host directory doesn't exist
- **Solution:** Create directories before enabling MCP

## MCP Configuration Errors

### docker-not-running
- **Error:** MCP timeout / connection refused
- **Cause:** Docker daemon not running
- **Solution:** Start Docker Desktop

### env-variable-not-set
- **Error:** MCP fails with auth error
- **Cause:** Environment variable placeholder not resolved
- **Example:** `{env:GITHUB_PERSONAL_ACCESS_TOKEN}` but env not set
