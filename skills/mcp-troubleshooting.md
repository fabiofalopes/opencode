---
name: mcp-troubleshooting
description: Step-by-step guide for diagnosing and fixing MCP server issues.
---

## Diagnostic Workflow
1. **Check configuration** – Confirm the server entry is enabled in `opencode.json` or the relevant `mcp-config/*.json`. Look for `"enabled": true` and verify the command, timeout, and environment blocks are present.
2. **Verify Docker** – For Docker-based servers, ensure Docker Desktop (macOS) or the Docker daemon (Linux) is running. Run `docker ps` to confirm.
3. **Validate environment variables** – Cross-check every variable referenced in the server's `environment` block is exported in your shell profile or `.env`. Missing values commonly trigger authentication failures.
4. **Manual server test** – Execute the exact Docker (or local) command defined in the config via terminal to reproduce errors outside OpenCode. This isolates config vs runtime problems.
5. **Inspect logs and errors** – Review terminal output, MCP server logs, or OpenCode error messages to pinpoint stack traces, permission issues, or missing files.

## Common Issues & Solutions
| Issue | Symptom | Fix |
|-------|---------|-----|
| Server disabled | Tool not available | Set `enabled: true` in the relevant `mcp-config` file and reload profiles |
| Docker not running | Connection refused | Start Docker Desktop (macOS) or systemd `docker` service (Linux) |
| Missing env var | Auth error responses | Export the required variable (e.g., `export BRAVE_API_KEY=...`) before launching OpenCode |
| Wrong path | File not found errors | Verify `environment` paths use the correct platform prefix (`/Users/...` vs `/home/...`) |
| Timeout | Server responds slowly or times out | Increase the `timeout` field for that server in config and rebuild |
| Invalid JSON | Config parse error on startup | Run `npx ts-node scripts/validate-config.ts` and fix formatting |

## Platform-Specific Path Issues
- **macOS:** Use `/Users/<username>/...` (e.g., `/Users/fabiofalopes/...`).
- **Linux:** Use `/home/<username>/...`.
- **Common mistake:** Copying Linux-style paths into macOS configs (`/home/fabio`), causing file lookups to fail. Always match the host OS path scheme.

## MCP Server Quick Reference
- **memory:** Requires data dir at `/Users/fabiofalopes/mcp-memory` (or equivalent) with correct permissions.
- **code_interpreter:** Needs `/Users/fabiofalopes/mcp-code` workspace; ensure the directory exists and is writable.
- **obsidian:** Depends on the Obsidian Local REST API plugin plus a valid API key/socket port configuration.
- **github:** Requires `GITHUB_PERSONAL_ACCESS_TOKEN` with repo scope stored in environment.
- **brave:** Requires `BRAVE_API_KEY` set before launching OpenCode.
- **perplexity:** Requires `PERPLEXITY_API_KEY` for authenticated requests.

## Validation Commands
- `npx ts-node scripts/validate-config.ts` – Validate MCP config schema and catch JSON/YAML errors.
- `npx ts-node scripts/manage-mcp.ts build` – Rebuild or regenerate MCP configuration artifacts after edits.
- `docker ps` – Confirm Docker daemon is running and list active containers.

## When to Load This Skill
- An MCP tool suddenly returns errors or becomes unavailable.
- "Server not responding" or timeout messages appear in logs.
- Immediately after adding or modifying an MCP server definition.
- During migration of OpenCode configuration to a new machine or OS.
