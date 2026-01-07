# Agent Specialization Matrix

Quick reference for choosing the right agent for your task.

## Primary Agents (User-Facing)

### `deep` - Analyze-First Builder ⚖️
**When to use:**
- Complex requests needing analysis before action
- Architectural decisions
- Multi-step implementations
- When you want thinking + execution

**Strengths:**
- Balanced agency (thinks then acts)
- Uses sequential_thinking for complex problems
- Asks confirmation on big changes
- Full tool access

**Temperature:** 0.3 (balanced creativity)

**Example prompts:**
```
@deep Add user authentication to the API
@deep Refactor the database layer for better performance
@deep Analyze this codebase and suggest improvements
```

---

### `know` - Knowledge Builder 📚
**When to use:**
- Research and learning tasks
- Building knowledge bases
- Multi-source information synthesis
- Creating structured documentation

**Strengths:**
- Multi-source research (arxiv, wikipedia, context7, etc.)
- Dual storage (markdown + memory)
- Knowledge accumulation over time
- Follow-up research suggestions

**Temperature:** 0.2 (focused, factual)

**Example prompts:**
```
@know Research JWT authentication patterns and create a guide
@know Build knowledge base about transformer architectures
@know Survey state-of-the-art in multi-agent systems (2023-2024)
```

---

### `build` - Direct Executor ⚡
**When to use:**
- Simple, clear tasks
- High confidence implementation
- Following explicit instructions
- When you want immediate action

**Strengths:**
- Full tool access
- Executes immediately
- No analysis overhead
- Fast iteration

**Temperature:** 0.3 (balanced)

**Example prompts:**
```
@build Fix the syntax error in api.py
@build Add logging to all API endpoints
@build Run the tests and show me the output
```

---

### `plan` - Analysis Only 📋
**When to use:**
- Exploring options without making changes
- Understanding existing code
- Strategic planning
- When you want recommendations only

**Strengths:**
- Read-only analysis
- Research tools available
- Sequential thinking
- TodoWrite planning

**Temperature:** 0.1 (focused)

**Example prompts:**
```
@plan Analyze the current architecture and suggest improvements
@plan What's the best way to implement caching here?
@plan Review this codebase for security issues
```

---

## Sub-Agents (Specialized)

### `code` - Development Specialist 💻
**When to use:**
- Code-focused implementation
- GitHub operations (issues, PRs)
- Testing and verification
- Following coding best practices

**Delegated by:** @deep, @build

**Example tasks:**
- Implement feature from design doc
- Create unit tests
- Fix type errors
- Create GitHub PR

---

### `research` - Information Synthesizer 🔍
**When to use:**
- Pure information gathering
- No knowledge storage needed
- Quick lookups
- Comparison tasks

**Delegated by:** @deep, @know

**Example tasks:**
- Compare FastAPI vs Flask
- Find documentation for library X
- Search for recent tutorials
- Get code examples from GitHub

---

### `thinking` - Deep Reasoning 🧠
**When to use:**
- Extremely complex reasoning (10+ steps)
- Multiple branching paths
- Contradictory requirements
- Philosophical/architectural deep-dives

**Delegated by:** @deep, @plan

**Example tasks:**
- Break down complex algorithm design
- Explore trade-offs in system architecture
- Reason about multiple conflicting requirements

---

## Decision Tree

```
Start Here
    ↓
Need to make changes?
    ├─→ NO → Want deep analysis?
    │        ├─→ YES → @plan
    │        └─→ NO  → @research (sub-agent)
    │
    └─→ YES → Is task complex/architectural?
             ├─→ YES → @deep (analyzes then executes)
             ├─→ NO  → Is it purely code?
             │         ├─→ YES → @code (sub-agent)
             │         └─→ NO  → @build (direct execution)
             │
             └─→ Is it research + documentation?
                 └─→ YES → @know (knowledge building)
```

---

## Agent Comparison Table

| Feature | deep | know | build | plan | code | research | thinking |
|---------|------|------|-------|------|------|----------|----------|
| **Mode** | Primary | Primary | Primary | Primary | Sub | Sub | Sub |
| **Write Files** | ✅ | ✅* | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Edit Files** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Bash Commands** | ✅ | ❌ | ✅ | ❌ | ✅† | ❌ | ❌ |
| **Research Tools** | ✅ | ✅ | ✅ | ✅ | Limited | ✅ | ✅ |
| **Memory** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Sequential Thinking** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Code Interpreter** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **GitHub Integration** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Temperature** | 0.3 | 0.2 | 0.3 | 0.1 | 0.2 | 0.2 | 0.2 |
| **Agency Level** | Balanced | Research | High | Low | High | Low | Analysis |

\* Only writes markdown documentation  
† Git commands require approval

---

## Common Workflows

### Research → Implementation
```
1. @know Research authentication patterns
   └─→ Outputs: markdown guide + memory entities

2. @deep Implement JWT auth based on research
   └─→ Reads knowledge, analyzes codebase, implements
```

### Complex Feature Development
```
1. @deep Analyze requirements and propose architecture
   └─→ Uses sequential_thinking, asks confirmation

2. @code Implement core functionality
   └─→ Delegated by @deep for pure coding

3. @build Add tests and run verification
   └─→ Quick execution tasks
```

### Exploration → Planning → Execution
```
1. @plan Analyze options for state management
   └─→ Read-only analysis, TodoWrite plan

2. @research Compare Redux vs Zustand vs Context
   └─→ Quick information synthesis

3. @deep Implement chosen solution
   └─→ Executes with architectural awareness
```

### Knowledge Base Building
```
1. @know Research React patterns (Level 3: Deep Dive)
   └─→ Multiple sources, structured markdown, memory graph

2. @know Research React hooks (adds to existing knowledge)
   └─→ Links to previous research, extends graph

3. @deep Refactor codebase using documented patterns
   └─→ Reads from knowledge base, applies patterns
```

---

## Tips for Effective Agent Usage

### 1. Be Explicit When Needed
If the default agent isn't right, tag explicitly:
```
@deep analyze this first   # Forces deep analysis
@build just do it          # Forces immediate execution
```

### 2. Chain Agents Across Sessions
Knowledge stored in memory and markdown persists:
```
Session 1: @know Research X
Session 2: @deep Implement X using previous research
```

### 3. Use @plan for Exploration
When unsure about approach:
```
@plan What are my options for implementing this?
@plan Review the pros/cons of these architectures
```

### 4. Delegate Intentionally
Trust agents to delegate when appropriate, but you can force delegation:
```
@deep Can you delegate the coding to @code?
@know After research, pass to @deep for implementation
```

### 5. Match Temperature to Task
- **High stakes** → @plan (0.1) for analysis
- **Balanced** → @deep (0.3) for complex work
- **Knowledge** → @know (0.2) for accuracy

---

## Anti-Patterns (What NOT to Do)

❌ **Don't use @know for implementation**
```
Bad:  @know Implement authentication
Good: @know Research authentication → @deep Implement it
```

❌ **Don't use @build for complex architectural changes**
```
Bad:  @build Refactor entire database layer
Good: @deep Refactor database layer (will analyze first)
```

❌ **Don't use @plan when you want action**
```
Bad:  @plan Fix this bug (won't make changes)
Good: @build Fix this bug (immediate action)
```

❌ **Don't use @code directly for planning**
```
Bad:  @code What's the best approach?
Good: @plan What's the best approach?
```

---

## Agent Philosophy Summary

| Agent | Philosophy |
|-------|-----------|
| **deep** | "Think before acting, but act decisively" |
| **know** | "Knowledge compounds over time" |
| **build** | "When in doubt, execute" |
| **plan** | "Explore without changing" |
| **code** | "Write quality code, test thoroughly" |
| **research** | "Synthesize information quickly" |
| **thinking** | "Break down complexity step-by-step" |

---

**Last Updated:** 2024-12-11  
**Next Review:** When new agents added or workflows evolve
