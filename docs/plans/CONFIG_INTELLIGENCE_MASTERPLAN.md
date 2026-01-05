# OpenCode Configuration Intelligence System — Master Plan

**Created:** 2026-01-05  
**Status:** Phase 3.5 – COMPLETE ✅  
**Last Updated:** 2026-01-05

---

## 1. Vision & Goals

Transform OpenCode configuration from static, fragile files into an intelligent, learning, machine-aware system that:

- Anticipates and prevents configuration errors before they surface
- Seamlessly supports multi-machine portability and platform differences
- Accumulates operational wisdom, lessons, and remediation patterns over time
- Evolves toward distributed learning, synchronizing insights across multiple operators and environments
- Ultimately enables federated intelligence where each node contributes to a global knowledge base

## 2. Origin Story

- Incident: `Invalid input: expected record, received array tools` surfaced in `conductor.md`
- Root cause: `tools:` frontmatter declared as a YAML array instead of the required record/object map
- Revealed deficiencies:
  - No authoritative schema for agent `.md` files
  - Lack of validation tooling for Markdown configuration
  - Zero machine awareness; configs assumed static paths and MCP availability

## 3. Architecture (5 Layers)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: Distributed Knowledge Network (Future)           │
│  └─ Federated learning from multiple machines/users        │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: Memory System (Local Learning)                   │
│  └─ Accumulated wisdom, past errors, patterns learned      │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: Machine Profiles                                 │
│  └─ Platform detection, per-machine paths, MCP availability│
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Skills (Procedural Knowledge)                    │
│  └─ config-management, mcp-troubleshooting, agent-schema   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: Validation & Schema (Foundation)                 │
│  └─ AGENT_MD_SCHEMA.md, validate-agents.ts                 │
└─────────────────────────────────────────────────────────────┘
```

## 4. Phase Breakdown (with checkboxes)

### Phase 1: Foundation (CRITICAL) ✅ COMPLETE
- [x] `docs/AGENT_MD_SCHEMA.md` – Exact YAML frontmatter spec
- [x] `scripts/validate-agents.ts` – Pre-flight validation
- [x] Update `AGENTS.md` with schema rules
- [x] Update `TROUBLESHOOTING_CONFIG.md`

### Phase 2: Skills System (HIGH) ✅ COMPLETE
- [x] `skills/config-management.md`
- [x] `skills/mcp-troubleshooting.md`
- [x] `skills/agent-schema.md`
- [x] Update `opencode-config-manager.md`

### Phase 3: Machine Awareness (MEDIUM) ✅ COMPLETE
- [x] `machines.json`
- [x] `scripts/detect-machine.ts`
- [x] `scripts/switch-machine.ts`
- [x] Path templating implementation

### Phase 3.5: Multi-Machine Git Safety (ENHANCEMENT) ✅ COMPLETE
- [x] Implement template system (`opencode.template.json` with `{{placeholders}}`)
- [x] Refactor script naming (`switch-machine.ts` → `init-machine.ts`)
- [x] Add `opencode.json` to `.gitignore` (generated file, not committed)
- [x] Create human-friendly setup guide: `docs/MACHINE_SETUP.md`
- [x] Post-pull automation (npm scripts + optional git hooks)

### Phase 3.6: Antigravity Fix Integration (IN PROGRESS)
- [x] Move `antigravity-json-schema-fix` from `~/projetos/` to `~/.config/opencode/temp/`
- [ ] **VERIFY CLAIMS BEFORE IMPLEMENTING** - Review scripts and docs in folder
- [ ] Extract useful documentation/solutions to proper locations
- [ ] Integrate with existing config management system if applicable
- [ ] Delete temp folder when integration complete

### Phase 4: Memory Integration (STRATEGIC) ✅ COMPLETE
- [x] Fix memory MCP paths
- [x] Create config knowledge entities
- [x] Memory-aware config manager

### Phase 5: Distributed Network (FUTURE)
- [ ] Design sync protocol
- [ ] Implement sync agent
- [ ] Central repository setup
- [ ] Knowledge refinery

## 5. Technical Specifications

### Agent .md Schema (from OpenCode docs)

```yaml
---
description: string  # REQUIRED
mode: "primary" | "subagent" | "all"  # Optional, default "all"
model: string  # Optional
temperature: number  # 0-1
maxSteps: number  # Optional

# CRITICAL: tools MUST be Record<string, boolean>
tools:
  write: true | false
  edit: true | false
  bash: true | false
  # etc.

permission:
  edit: "allow" | "deny" | "ask"
  bash: "allow" | "deny" | "ask" | { pattern: action }
  webfetch: "allow" | "deny" | "ask"
---
```

### Machine Profile Schema

```json
{
  "machine-id": {
    "platform": "darwin" | "linux" | "win32",
    "hostname": "string",
    "paths": {
      "mcp-memory": "/absolute/path",
      "mcp-code": "/absolute/path"
    },
    "mcps": {
      "server-name": true | false
    }
  }
}
```

### Current Machine Issue

- Platform: macOS (`darwin`)
- Memory MCP misconfigured to `/home/fabio/mcp-memory` (Linux path)
- Correct path should be `/Users/fabiofalopes/mcp-memory` or `~/mcp-memory`

## 6. File Locations

```
~/.config/opencode/
├── docs/
│   ├── plans/
│   │   └── CONFIG_INTELLIGENCE_MASTERPLAN.md  # THIS FILE
│   ├── AGENT_MD_SCHEMA.md                     # Phase 1
│   └── TROUBLESHOOTING_CONFIG.md              # Update Phase 1
├── skills/
│   ├── config-management.md                   # Phase 2
│   ├── mcp-troubleshooting.md                 # Phase 2
│   └── agent-schema.md                        # Phase 2
├── scripts/
│   ├── validate-agents.ts                     # Phase 1
│   ├── detect-machine.ts                      # Phase 3
│   └── switch-machine.ts                      # Phase 3
├── machines.json                              # Phase 3
├── mcp-config/
│   └── memory.json                            # Fix in Phase 4
├── knowledge/
│   ├── README.md                               # Phase 4
│   ├── config-errors.md                        # Phase 4
│   └── config-remediations.md                  # Phase 4
├── agent/
│   └── opencode-config-manager.md              # Phase 4 (memory-aware)
├── temp/
│   └── antigravity-json-schema-fix/      # Phase 3.6 (pending review, delete when done)
├── .opencode/agent/
│   └── opencode-config-manager.md             # Update Phase 2
└── AGENTS.md                                  # Update Phase 1
```

## 7. Session Handoff Protocol

### 🚀 How to Resume This Project

**Copy-paste this command to continue:**

```
Resume CONFIG_INTELLIGENCE project.
Read docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md and continue with Phase 3.6.
```

> ⚠️ **Update the phase number** in the command after each phase completes!

### 📋 End of Session Checklist

Before closing any session:
- [ ] All work saved to files (not just in conversation)
- [ ] Pending tasks written to plan files (not just TodoWrite)
- [ ] Masterplan checkboxes updated  
- [ ] Status line (line 4) reflects current phase
- [ ] Resume command above shows correct next phase

### 💡 Why This Works

| Component | Purpose |
|-----------|---------|
| **Masterplan** | Single source of truth with progress checkboxes |
| **Resume command** | Exact instruction for next session |
| **Skills** | Reusable knowledge (load with `Load skill: <name>`) |

**Result:** The agent picks up exactly where it left off. Zero context loss.

## 8. Success Criteria

### Phase 1 Complete When
- `npx ts-node scripts/validate-agents.ts` catches YAML structure errors (including tools array misuse)
- `docs/AGENT_MD_SCHEMA.md` exists with authoritative examples
- `AGENTS.md` documents schema expectations explicitly

### Phase 2 Complete When
- `skills/config-management.md`, `skills/mcp-troubleshooting.md`, and `skills/agent-schema.md` exist and can be loaded
- `opencode-config-manager.md` references the new skills in its prompt logic

### Phase 3 Complete When
- `npm run switch:machine macos-fabio` (or equivalent) selects the correct profile
- MCP paths resolve to platform-appropriate directories automatically

### Phase 4 Complete When
- Memory MCP functions on the current machine without manual edits
- Config manager consults memory entities before applying changes

### Phase 3.5 Complete When
- `opencode.json` is gitignored and generated from template
- Script names are intuitive and well-documented
- New users can setup their machine by following `docs/MACHINE_SETUP.md`
- Pushing from any machine never breaks other machines' configs

### Phase 5 Complete When
- Knowledge synchronizes between at least two machines/operators
- A central repository aggregates and refines configuration learnings

## 9. Quick Reference

| Task | Command/Location |
|------|------------------|
| Validate agents | `npx ts-node scripts/validate-agents.ts` |
| Switch machine | `npm run switch:machine <name>` |
| Check schema | `docs/AGENT_MD_SCHEMA.md` |
| Resume project | Read this file, find next unchecked task |

---

This master plan is the single source of truth for the OpenCode Configuration Intelligence project. Always update this document as progress is made to ensure seamless multi-session continuity.
