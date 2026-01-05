---
name: multi-session-work
description: Framework for managing complex work across multiple agentic sessions
---

# Multi-Session Work Framework

## Core Principle

> **"Agents manage context like humans manage time."**

Just as humans are constrained by time (24 hours/day) and must manage it through calendars and schedules, agents are constrained by context (finite window per session) and must manage it through documentation and state persistence.

## When to Apply This Framework

### Recognition Triggers

Use multi-session protocol when:
- Task has **5+ distinct deliverables**
- Requires **research + implementation + testing** cycles
- User uses words like "project", "system", "comprehensive", "architecture"
- Estimated work would consume **>50% of context window**
- Work involves **learning + applying** (not just one or the other)
- Previous attempts at similar scope failed due to complexity

### Work Classification

| Type | Characteristics | Approach |
|------|-----------------|----------|
| **Trivial** | 1 action, immediate | Just do it |
| **Simple** | 2-3 steps, single session | Use TodoWrite |
| **Complex** | 4-10 steps, may span sessions | Mini-plan + handoff |
| **Project** | 10+ steps, definitely multi-session | Full master plan + skill |

## The Multi-Session Protocol

### Phase 1: PLAN (First Session)

1. **Decompose** the work into phases and tasks
2. **Create master document**: `docs/plans/PROJECT_NAME_MASTERPLAN.md`
   - Vision and goals
   - Architecture/approach
   - Phase breakdown with checkboxes
   - Success criteria
   - Session handoff protocol
3. **Create resume skill**: `skills/project-name-resume.md`
   - How to continue this specific project
   - Quick reference commands
   - Current state notes

### Phase 2: EXECUTE (Each Session)

1. **Load context**: Read master plan, check progress
2. **Identify next task**: First unchecked item in current phase
3. **Execute**: Complete the task fully
4. **Update state**: Check off completed items, add notes
5. **Assess**: Can continue or need to handoff?

### Phase 3: HANDOFF (End of Session)

Before session ends:
1. **Save all work**: Ensure files are written
2. **Update master plan**: Progress checkboxes, notes
3. **Update skill**: Add any session-specific learnings
4. **(Optional)** Create `SESSION_HANDOFF.md` for complex state

### Phase 4: RESUME (Next Session)

1. Load the resume skill: `skill({ name: "project-name-resume" })`
2. Follow the resume procedure
3. Continue from Phase 2

## File Structure Pattern

```
~/.config/opencode/
├── docs/plans/
│   └── PROJECT_NAME_MASTERPLAN.md    # Source of truth
├── skills/
│   └── project-name-resume.md        # Resume procedure
└── [deliverables as specified in plan]
```

## Optimizing Within Sessions

### Use Sub-Agents for Parallelization

Within a session, leverage sub-agents:
```
@conductor orchestrates
  ├── @code: Implementation tasks (parallel when independent)
  ├── @research: Information gathering
  ├── @scribe: Documentation
  └── @policy: Validation
```

### Context Efficiency

- **Front-load research**: Gather info early, act on it later
- **Batch similar tasks**: File reads together, writes together
- **Externalize early**: Write findings to files, don't hold in context
- **Reference, don't repeat**: Point to docs rather than re-explaining

## State Management Rules

### What Dies With the Session
- Conversation history
- In-context reasoning
- Uncommitted plans
- Verbal agreements

### What Persists Across Sessions
- Files written to disk
- Git commits
- Updated documentation
- Checked-off items in plans

### The Golden Rule
> **"If it's not in a file, it doesn't exist for the next session."**

### Critical Rule: Externalize Immediately

**TodoWrite is ephemeral. Files are permanent.**

- ❌ BAD: Adding pending tasks only to TodoWrite (lost when session ends)
- ✅ GOOD: Write pending tasks to masterplan/plan files immediately

When user mentions future work or pending tasks:
1. Add to TodoWrite for current session tracking
2. **IMMEDIATELY** write to the relevant plan file (e.g., `docs/plans/*.md`)
3. Confirm to user that it's persisted to disk

## Anti-Patterns to Avoid

❌ **Starting complex work without a plan**
- Leads to lost progress, repeated work

❌ **Keeping state only in conversation**
- Next session has no memory of decisions made

❌ **Monolithic sessions trying to "finish everything"**
- Context exhaustion, degraded performance

❌ **Plans that are write-once**
- Become stale, lose utility

❌ **Over-documenting trivial work**
- Wasted effort, cluttered files

## Examples

### Good: Complex Feature Implementation
```
Session 1: Plan + Architecture doc + Resume skill
Session 2: Core implementation (files 1-3)
Session 3: Core implementation (files 4-6) + tests
Session 4: Integration + documentation
```

### Good: Research Project
```
Session 1: Scope definition + Plan + Initial research
Session 2: Deep research + Notes consolidation
Session 3: Synthesis + Recommendations doc
Session 4: Implementation of recommendations
```

### Bad: Trying to Do Everything
```
Session 1: Start research, get sidetracked, run out of context,
           lose half the work, frustrated user
```

## Integration with OpenCode

### In AGENTS.md
Reference this skill as a core practice for all agents.

### In @conductor
This is native behavior - orchestrate multi-session projects.

### In Other Agents
Can load this skill when recognizing complex work scope.

## Quick Reference

| Situation | Action |
|-----------|--------|
| User asks for "project" | Trigger multi-session protocol |
| Task list > 5 items | Create master plan |
| Session nearing end | Update progress, prepare handoff |
| Starting new session | Load resume skill first |
| Sub-task is independent | Consider parallel sub-agent |

## Meta: This Skill is Self-Applying

This skill itself follows the pattern it teaches:
- It's documented for persistence
- It can be loaded in any session
- It guides behavior across all future complex work
- It will be updated as we learn more

---

*"The measure of good agentic work is not what was accomplished in one session, but what can be continued in the next."*
