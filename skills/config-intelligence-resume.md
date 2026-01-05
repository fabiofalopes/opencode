---
name: config-intelligence-resume
description: Resume work on the OpenCode Configuration Intelligence System project
---

## What This Skill Does

Provides a systematic approach to resuming work on the CONFIG_INTELLIGENCE multi-session project.

## When To Use

Use this skill when:
- Starting a new session that should continue this project
- Unsure where we left off
- Need to understand the current state of the project

## Resume Procedure

### Step 1: Read the Master Plan
```
Read: docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md
```

### Step 2: Check Phase Progress
Look at Section 4 "Phase Breakdown" for checkbox status:
- `[ ]` = Not started
- `[x]` = Completed

### Step 3: Identify Current Phase
Phases are sequential with priorities:
1. **Phase 1: Foundation** (CRITICAL) - Must complete first
2. **Phase 2: Skills** (HIGH) - Depends on Phase 1
3. **Phase 3: Machine Awareness** (MEDIUM) - Can parallel Phase 2
4. **Phase 4: Memory** (STRATEGIC) - Depends on Phase 3
5. **Phase 5: Distributed** (FUTURE) - Long-term goal

### Step 4: Pick Next Task
Select the first unchecked `[ ]` item in the current phase.

### Step 5: Execute
For each task type:

**Documentation Tasks** (AGENT_MD_SCHEMA.md, etc.):
- Research official OpenCode docs if needed
- Create comprehensive, example-rich content
- Include both ✅ correct and ❌ wrong examples

**Script Tasks** (validate-agents.ts, etc.):
- Follow existing script patterns in `scripts/`
- Add to package.json if CLI command needed
- Test before marking complete

**Skill Tasks** (skills/*.md):
- Follow skill schema (name, description in frontmatter)
- Make actionable and specific
- Include code examples

**Update Tasks** (AGENTS.md, config-manager, etc.):
- Read current content first
- Make targeted additions
- Don't break existing functionality

### Step 6: Update Progress
After completing a task:
1. Check off the item in MASTERPLAN.md: `[ ]` → `[x]`
2. Add completion date if significant
3. Note any issues encountered

## Quick Commands

| Action | Command |
|--------|---------|
| Read master plan | `read docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md` |
| Validate agents | `npx ts-node scripts/validate-agents.ts` |
| Check all scripts | `ls scripts/*.ts` |
| Check all skills | `ls skills/*.md` |

## Project Context

**Origin**: Config error in conductor.md (tools array vs record)
**Goal**: Intelligent, learning, machine-aware config system
**Layers**: 5 (Validation → Skills → Machines → Memory → Distributed)

## Current Machine Info

When working on machine-specific tasks:
- Check platform: `process.platform` or `uname`
- Current: macOS (darwin)
- Issue: MCP paths hardcoded for Linux

## Handoff Notes

Space for notes between sessions:
- [Add notes here as project progresses]
