# OpenCode Agent Configuration Schema

## Overview
Agent definition files (`.md`) configure how OpenCode agents behave. Each file contains YAML frontmatter followed by optional markdown notes. The frontmatter drives tooling access, safety permissions, execution mode, and other runtime characteristics. Consistent structure prevents configuration drift and enables automated validation.

## Frontmatter Specification
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | optional | Human-readable label shown in UIs. |
| `description` | string | **required** | Single-sentence role summary. |
| `type` | `"primary" \| "sub-agent"` | optional | Legacy flag; prefer `mode`. |
| `mode` | `"primary" \| "subagent" \| "all"` | optional | Determines availability scope. |
| `temperature` | number (0-1) | optional | Model sampling temperature. |
| `tools` | **Record<string, boolean>** | optional | Maps tool name to enablement flag. **Must be key-value pairs, never an array.** |
| `permission` | object | optional | Controls `edit`, `bash`, `webfetch`, etc. Values may be strings (allow/deny/ask) or nested patterns. |

### Tools Field (Critical)
```
tools:
  write: true
  edit: true
  bash: false
```
- Each entry toggles a tool explicitly.
- Missing tools default to disabled unless inherited elsewhere.
- Arrays like `tools: ["write", "edit"]` are invalid and break the loader.

### Permission Field
- Simple form: `permission: { edit: "allow", bash: "ask" }`
- Pattern form:
  ```yaml
  permission:
    bash:
      "scripts/*.sh": allow
      "*": deny
  ```

## Examples

✅ **Correct**
```yaml
---
description: "Primary code agent"
mode: all
temperature: 0.2
tools:
  write: true
  edit: true
  bash: true
  sequential_thinking: true
permission:
  edit: allow
  bash:
    "*.sh": allow
    "*": ask
---
```

❌ **Wrong (tools as array)**
```yaml
---
description: "Broken agent"
tools:
  - write
  - edit
---
```

## Common Errors
1. Declaring `tools` as a list instead of a record (causes schema crash).
2. Omitting `description` (required for documentation and prompts).
3. Mixing `type` and `mode` inconsistently—prefer `mode` going forward.
4. Using unauthorized permission strings; only `allow`, `deny`, `ask` are valid unless using pattern objects.

## Future Validation
A forthcoming script (`scripts/validate-agents.ts`) will lint every agent file, ensuring this schema is followed before deployment. Keeping files compliant now will guarantee a smooth rollout once validation becomes mandatory.
