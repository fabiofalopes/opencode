# Configuration Remediation Procedures

Proven solutions for common configuration issues.

## Quick Fixes

### Fix array-to-object corruption (CRITICAL)
1. Symptoms: OpenCode fails with `Invalid input: expected array, received object`
2. Affected: `plugin`, `instructions`, `modalities.input`, `modalities.output`
3. Do NOT try to manually fix the JSON
4. Run: `npx ts-node scripts/init-machine.ts` (regenerates from template)
5. Verify: `opencode` should start without errors

### Fix tools array error
1. Open agent file in `.opencode/agent/` or agent definition in `opencode.json`
2. Find `tools:` section
3. Change from array format to record format
4. Run `npx ts-node scripts/validate-agents.ts` to verify

### Fix path mismatches
1. Run `npm run detect:machine` to identify current platform
2. Check `machines.json` for correct paths
3. Run `npm run switch:machine <machine-id>` or manually update opencode.json
4. Verify paths exist: `ls -la <path>`

### Fix MCP not responding
1. Check Docker: `docker ps`
2. Check server enabled: `grep -A5 "server_name" opencode.json`
3. Check timeout: increase if slow network
4. Check environment variables: `echo $VAR_NAME`

## Validation Workflow

1. **Before changes:** Run `npx ts-node scripts/validate-agents.ts`
2. **After changes:** Restart OpenCode to apply
3. **Test MCP:** Use simple tool call to verify

## Memory System

When fixing issues, store learnings:
- Entity: config-error or config-fix
- Relations: causes, solves, relates-to
- Observations: context, timestamp, outcome
