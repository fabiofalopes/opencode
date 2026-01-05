---
name: agent-schema
description: Quick reference for the agent YAML frontmatter schema
---

## Purpose
Quick reference for creating or editing agent `.md` files located in `.opencode/agent/` or `~/.config/opencode/agent/` as part of the CONFIG_INTELLIGENCE project (Phase 2).

## Schema Quick Reference
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `description` | string | ✅ YES | - |
| `mode` | `"primary"` \| `"subagent"` \| `"all"` | No | `"all"` |
| `temperature` | number (0-1) | No | model default |
| `tools` | `Record<string, boolean>` | No | all enabled |
| `permission` | object | No | ask for all |

## THE CRITICAL RULE
```yaml
# ✅ CORRECT - tools as key-value pairs
tools:
  write: true
  edit: true
  bash: false

# ❌ WRONG - tools as array (causes "expected record, received array")
tools:
  - write
  - edit
```

## Minimal Valid Agent
```yaml
---
description: Short description of what this agent does
---
```

## Full Example
```yaml
---
description: Expert code reviewer
mode: subagent
temperature: 0.2
tools:
  read: true
  grep: true
  glob: true
  write: false
  bash: false
permission:
  edit: deny
  bash: deny
---
```

## Validation Command
Run `npm run validate:agents` or `npx ts-node scripts/validate-agents.ts` after editing agents.

## Reference
See `docs/AGENT_MD_SCHEMA.md` for the complete schema documentation.

## When to Load This Skill
- Creating a new agent
- Editing agent frontmatter
- Troubleshooting agent load errors
