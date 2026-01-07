# OpenCode Architecture & Agent Orchestration

**Version:** 1.0  
**Date:** 2024-12-11  
**Status:** Active Development

---

## Executive Summary

This document describes the multi-agent architecture for our OpenCode configuration, designed to solve the fundamental tension between **analysis paralysis** and **premature action** through intelligent agent specialization and orchestration.

**Core Insight:** Different tasks require different levels of agency. Match task complexity to agent capability.

---

## Table of Contents

1. [Vision & Philosophy](#vision--philosophy)
2. [Architecture Overview](#architecture-overview)
3. [Agent Ecosystem](#agent-ecosystem)
4. [Orchestration Patterns](#orchestration-patterns)
5. [Knowledge Management](#knowledge-management)
6. [Implementation Status](#implementation-status)
7. [Future Roadmap](#future-roadmap)

---

## Vision & Philosophy

### The Problem We Solve

**The Agency Dilemma:**
- **Too much agency** → Agent acts before understanding, makes unwanted changes
- **Too little agency** → Agent only analyzes, never executes, frustrates user

**The Solution:**
- **Balanced agency through specialization** → Right agent for right task
- **Meta-orchestration** → Agents that can delegate to specialized sub-agents
- **Knowledge accumulation** → Learning compounds over sessions

### Design Principles

1. **Specialization over generalization** - Purpose-built agents for specific workflows
2. **Think proportionally** - Match analysis depth to task complexity
3. **Knowledge compounds** - Build reusable intellectual assets
4. **Transparency over magic** - Clear decision points, explicit confirmations
5. **Progressive enhancement** - Start simple, grow sophisticated
6. **Session continuity** - Context persists across conversations

---

## Architecture Overview

### Hierarchical Multi-Agent System

```
┌─────────────────────────────────────────────────────────────┐
│                   USER INTERFACE                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
┌─────▼──────┐       ┌─────────▼────────┐
│  PRIMARY   │       │   PRIMARY         │
│  AGENTS    │       │   AGENTS          │
│            │       │                   │
│  • deep    │       │  • know           │
│  • build   │       │  • plan           │
│            │       │                   │
│ (Native)   │       │ (Custom)          │
└─────┬──────┘       └─────────┬─────────┘
      │                        │
      │   Can delegate to      │
      │                        │
      └────────┬───────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐  ┌────▼────┐  ┌────▼────┐
│ code   │  │research │  │thinking │
│(Native)│  │(Native) │  │(Native) │
└────────┘  └─────────┘  └─────────┘
    SUB-AGENTS (Specialized)
```

### Component Layers

```
┌─────────────────────────────────────────┐
│        AGENT LAYER                      │
│  (Primary + Sub-agents)                 │
├─────────────────────────────────────────┤
│        MCP TOOL LAYER                   │
│  11 servers, 50+ tools                  │
│  (context7, memory, arxiv, etc.)        │
├─────────────────────────────────────────┤
│        STORAGE LAYER                    │
│  • MCP Memory (semantic graph)          │
│  • Markdown Files (human-readable)      │
│  • Git Repository (version control)     │
├─────────────────────────────────────────┤
│        FOUNDATION LAYER                 │
│  • OpenCode Core                        │
│  • Model Configuration (GitHub Copilot) │
│  • Custom TypeScript Tools              │
└─────────────────────────────────────────┘
```

---

## Agent Ecosystem

### Primary Agents (User-Facing)

#### **deep** - Analyze-First Builder ⚖️

**Philosophy:** "Think before acting, but act decisively"

**Unique Capability:** Balanced agency with complexity-aware workflows

**Decision Framework:**
1. Simple task → Execute immediately
2. Moderate complexity → Brief sequential_thinking → Execute
3. High complexity → Deep analysis → Confirm → Execute
4. Ambiguous → Clarify first

**Tool Access:** Full (all read, write, bash, research, execution)

**Temperature:** 0.3 (balanced)

**Use Cases:**
- Complex multi-step implementations
- Architectural decisions
- Refactoring with analysis
- When you want thinking + execution

**Key Behavior:**
```
Request → Assess Complexity
    ↓
Simple? → Execute
    ↓
Complex? → sequential_thinking → Propose → Confirm → Execute
```

---

#### **know** - Knowledge Builder 📚

**Philosophy:** "Knowledge compounds over time"

**Unique Capability:** Dual storage (markdown + memory) with structured research

**Research Workflow:**
```
1. Intake & Scope
2. Multi-Source Research (context7, arxiv, wikipedia, gh_grep, etc.)
3. Structure & Organize (sequential_thinking synthesis)
4. Dual Storage:
   - MCP Memory: Entities + Relations
   - Markdown: docs/knowledge/
5. Suggest Follow-Up Topics
```

**Tool Access:** Research tools + write (markdown only) + memory

**Temperature:** 0.2 (focused, factual)

**Output Locations:**
- `docs/knowledge/research/` - Quick research notes
- `docs/knowledge/topics/` - Deep-dive documentation
- `docs/knowledge/libraries/` - Framework/library guides
- `docs/knowledge/papers/` - Academic paper summaries
- MCP Memory - Semantic graph for agents

**Use Cases:**
- Building knowledge bases
- Multi-source research synthesis
- Learning new technologies
- Creating structured guides

**Key Behavior:**
```
Research Query → Multi-Source Search → Synthesize → Store Dual Format
    ↓
Memory: Entities + Relations (machine-readable)
    ↓
Markdown: Structured docs (human-readable)
    ↓
Suggest: Follow-up research topics
```

---

#### **build** - Direct Executor ⚡ (Native OpenCode)

**Philosophy:** "When in doubt, execute"

**Use Cases:**
- Simple, well-defined tasks
- Following explicit instructions
- Quick iterations
- Immediate action needed

---

#### **plan** - Analysis Only 📋 (Native OpenCode)

**Philosophy:** "Explore without changing"

**Use Cases:**
- Understanding codebases
- Exploring options
- Strategic planning
- When you want recommendations only

---

### Sub-Agents (Specialized)

#### **code** - Development Specialist 💻 (Native)
- Focus: High-quality code, GitHub integration, testing
- Delegated by: deep, build

#### **research** - Information Synthesizer 🔍 (Native)
- Focus: Quick information gathering without storage
- Delegated by: deep, know

#### **thinking** - Deep Reasoning 🧠 (Native)
- Focus: Complex multi-step reasoning (10+ steps)
- Delegated by: deep, plan

---

## Orchestration Patterns

### Pattern 1: Research → Implementation

```mermaid
graph LR
    A[User: Need auth system] --> B[@know: Research patterns]
    B --> C[Outputs: markdown + memory]
    C --> D[@deep: Implement from research]
    D --> E[Reads knowledge, analyzes, executes]
```

**Example:**
```
Session 1:
User: @know Research JWT authentication patterns
Know: [Multi-source research] → Outputs guide + memory entities

Session 2:
User: @deep Implement JWT auth based on previous research
Deep: [Reads from memory + markdown] → Analyzes codebase → Implements
```

---

### Pattern 2: Complex Feature Development

```
User: Add real-time notifications
    ↓
@deep (primary orchestrator)
    ↓
    ├─→ Reads codebase
    ├─→ Uses sequential_thinking (5 steps)
    ├─→ Proposes architecture
    ├─→ Gets user confirmation
    └─→ Delegates to @code for implementation
        ↓
        @code implements with tests
            ↓
            @build verifies and runs tests
```

---

### Pattern 3: Knowledge Base Building

```
Week 1: @know Research React patterns (Level 3 deep-dive)
    └─→ Creates rich markdown + memory graph

Week 2: @know Research React hooks (adds to existing)
    └─→ Links to previous research, extends graph

Week 3: @deep Refactor codebase using patterns
    └─→ Reads knowledge base → Applies documented patterns
```

**Outcome:** Knowledge compounds, each session builds on previous work

---

### Pattern 4: Exploratory Development

```
@plan What are options for state management?
    ↓
    Outputs: Analysis of Redux vs Zustand vs Context

@research Compare recent benchmarks
    ↓
    Quick synthesis of performance data

@deep Implement Zustand with migration plan
    ↓
    Executes with architectural awareness
```

---

## Knowledge Management

### Dual Storage Strategy

**Why both?**
- **Markdown** = Human-readable, versionable, permanent record
- **MCP Memory** = Machine-readable, semantic graph, agent reasoning layer

### MCP Memory Structure

**Entities:**
```javascript
{
  name: "JWT Authentication",
  entityType: "concept",
  observations: [
    "Token-based auth mechanism",
    "Standard defined in RFC 7519",
    "Commonly paired with refresh tokens",
    "Scalable but revocation challenging"
  ]
}
```

**Relations:**
```javascript
{
  from: "JWT Authentication",
  to: "OAuth2",
  relationType: "often_used_with"
}
```

**Benefits:**
- Agents can discover connections
- Cross-reference knowledge automatically
- Evolve understanding over time

### Markdown Documentation

**Structure:**
```
docs/knowledge/
├── research/          # Quick notes (Level 1-2)
├── topics/            # Deep dives (Level 3)
├── libraries/         # Framework guides
└── papers/            # Academic summaries
```

**Template** (YAML frontmatter + structured sections):
```markdown
---
title: JWT Authentication
date: 2024-12-11
status: final
tags: [auth, security, api]
sources: 5
related: [oauth2.md, session-auth.md]
---

# JWT Authentication

## Overview
[2-3 sentence summary]

## Key Concepts
...

## Sources
1. [RFC 7519](https://tools.ietf.org/html/rfc7519)
2. [Auth0 Guide](https://auth0.com/docs/jwt)
...
```

**Benefits:**
- Git-trackable history
- Human-readable
- Searchable with grep
- Integrates with existing docs

---

## Implementation Status

### ✅ Completed (Phase 1)

- [x] Directory structure reorganized
- [x] Native agents validated (build, plan, code, research, thinking)
- [x] Documentation consolidated in `docs/`
- [x] MCP servers configured and tested (11 active)
- [x] Custom tools functional (analyze, fabric, git-info, project-info)
- [x] Agent analysis completed (studied Cline, Aider, Claude Code patterns)
- [x] Memory strategy defined (dual storage)

### ✅ Completed (Phase 2 - This Session)

- [x] **deep** agent designed and implemented
- [x] **know** agent designed and implemented
- [x] Agent specialization matrix created
- [x] Knowledge directory structure created (`docs/knowledge/`)
- [x] Architecture documentation written

### 🚧 In Progress (Phase 3)

- [ ] Update `opencode.json` to register `deep` and `know` agents
- [ ] Test `deep` agent on real complex tasks
- [ ] Test `know` agent on research workflows
- [ ] Initialize git repository with `.gitignore`

### 📋 Planned (Phase 4)

- [ ] Refine agent prompts based on usage patterns
- [ ] Create example workflows documentation
- [ ] Build initial knowledge base (test `know` agent)
- [ ] Document meta-orchestration patterns that emerge
- [ ] Create agent prompt templates for future customization

---

## Future Roadmap

### Short-Term (1-2 months)

**Agent Refinement:**
- Fine-tune `deep` confirmation thresholds based on usage
- Optimize `know` research depth levels
- Create agent performance metrics

**Knowledge Building:**
- Build 5-10 foundational knowledge bases
- Establish cross-referencing patterns
- Test memory graph quality

**Workflows:**
- Document 10 common orchestration patterns
- Create quick-start guides
- User feedback integration

### Medium-Term (3-6 months)

**Advanced Orchestration:**
- Router agent (fast model for task classification)
- Context manager (progressive summarization)
- Async task queue (parallel execution)

**Agent Expansion:**
- Domain-specific experts (n8n workflows, specific frameworks)
- Testing specialist agent
- Documentation generator agent

**Infrastructure:**
- Performance monitoring
- Cost tracking
- Agent analytics dashboard

### Long-Term (6-12 months)

**Vision Realization:**
- Full hierarchical orchestration (from `opencode-multi-agent-analysis.md`)
- Dynamic agent creation based on project needs
- ML-based routing decisions
- Community-contributed expert agents

**Platform:**
- Agent marketplace/sharing
- Best practice library
- Template repository

---

## Technical Specifications

### Model Configuration

**Current Setup (GitHub Copilot):**
```json
{
  "deep": "github-copilot/claude-sonnet-4.5",
  "know": "github-copilot/claude-haiku-4.5",
  "build": "github-copilot/claude-sonnet-4.5",
  "plan": "github-copilot/claude-haiku-4.5",
  "code": "github-copilot/gpt-5.1-codex",
  "research": "github-copilot/claude-opus-4.5",
  "thinking": "github-copilot/claude-sonnet-4.5"
}
```

**Rationale:**
- `deep` needs balanced capability (Sonnet)
- `know` benefits from speed for research (Haiku)
- `code` specialized for coding (Codex)
- `research` needs depth (Opus)

### Tool Distribution

| Category | Tools | Available To |
|----------|-------|--------------|
| **File Ops** | read, write, edit, list, glob, grep | deep, build, code |
| **Execution** | bash, code_interpreter | deep, build, code |
| **Research** | context7, arxiv, wikipedia, duckduckgo, gh_grep | All agents |
| **Cognitive** | sequential_thinking, memory | deep, know, plan, thinking |
| **GitHub** | github API tools | code only |

### Data Persistence

**MCP Memory:**
- Location: `~/mcp-memory/`
- Format: SQLite database (managed by MCP)
- Access: All agents with memory tool enabled
- Backup: Should be included in git repo consideration

**Markdown Knowledge:**
- Location: `docs/knowledge/`
- Format: Markdown with YAML frontmatter
- Access: All agents (read), know agent (write)
- Version Control: Git-tracked

---

## Decision Records

### DR-001: Why Dual Storage (Markdown + Memory)?

**Context:** Knowledge can be stored in MCP memory XOR markdown files

**Decision:** Use BOTH

**Rationale:**
- Memory = Machine reasoning, semantic connections, cross-session retrieval
- Markdown = Human reading, git history, long-term archive
- They serve different purposes and complement each other

**Alternatives Considered:**
- Memory only: Lost human-readability, no git tracking
- Markdown only: Lost semantic connections, harder for agents to reason

---

### DR-002: Why `deep` Instead of Enhancing `build`?

**Context:** Could modify native `build` agent vs. create new `deep` agent

**Decision:** Create separate `deep` agent

**Rationale:**
- Preserve native `build` for simple, fast execution
- `deep` addresses different use case (analysis + execution)
- Users can choose based on task complexity
- Easier to iterate and refine separately

**Trade-offs:**
- More agents to understand (mitigated by AGENT_MATRIX.md)
- Clear specialization benefits outweigh complexity cost

---

### DR-003: Why `know` Writes Markdown But Not Code?

**Context:** `know` agent permission design

**Decision:** Allow write (markdown only), deny edit, deny bash

**Rationale:**
- Knowledge-building requires creating new documentation
- Should not modify existing code
- Should not execute commands (research only)
- Clear separation from implementation agents

**Implementation:** Permission model enforced by OpenCode framework

---

## References

### Internal Documents
- `AGENTS.md` - Project-specific agent instructions
- `AGENT_MATRIX.md` - Quick reference for agent selection
- `MCP_TOOLS.md` - Complete MCP tool documentation
- `SYSTEM_CONTEXT.md` - System configuration context
- `opencode-multi-agent-analysis.md` - Original vision document

### External References
- **Claude Code** - `hub/agentic-system-prompts/agents/claude-code/`
- **Aider** - `hub/agentic-system-prompts/agents/aider/`
- **Cline** - `hub/agentic-system-prompts/agents/cline/`

### Configuration Files
- `opencode.json` - Main configuration
- `.opencode/agent/*.md` - Agent definitions
- `.opencode/tool/*.ts` - Custom tools

---

## Contributing & Evolution

This architecture is designed to evolve. As we:
- Use the agents in real workflows
- Discover new patterns
- Identify gaps or redundancies
- Learn from the community

We will:
1. Update this document
2. Refine agent prompts
3. Create new specialized agents
4. Share learnings with the OpenCode community

**Living Document:** This architecture reflects our current understanding and will grow with our needs.

---

**Maintained by:** User (fabiofalopes)  
**Last Updated:** 2024-12-11  
**Next Review:** After 1 month of active usage

---

## Appendix: Original Vision

The comprehensive vision from `opencode-multi-agent-analysis.md` remains our north star:

- **Router Agent** - Fast model for intelligent task routing
- **Context Manager** - Isolation, summarization, state tracking
- **Async Task Queue** - Parallel execution
- **Agent Specialization** - Match complexity to capability

This architecture represents **Phase 1** of that vision - establishing the foundational agents and patterns. The router, context manager, and async queue will come in future phases as we validate these patterns work in practice.

**The journey from vision to reality is iterative. We're building the foundation first.**
