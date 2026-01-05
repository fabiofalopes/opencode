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
