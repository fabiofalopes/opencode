# Profile & Model Quick Reference

**Purpose:** Quick comparison of all profiles and their model assignments  
**Last Updated:** 2026-01-03

---

## Profile Comparison Matrix

| Profile | Status | Cost | Speed | Quality | Context | Best For |
|---------|--------|------|-------|---------|---------|----------|
| **zens** | PRIMARY | FREE* | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Large | Code generation, agentic workflows |
| **gemini** | SECONDARY | FREE | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Huge (1M) | Multimodal, thinking, research |
| **copilot** | TERTIARY | $$$$ | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 200K | Diversified models, enterprise |
| **grok** | FALLBACK | FREE | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ | Medium | Simple tasks, fast iteration |

\* *Free during promotional period*

---

## Model Capabilities Breakdown

### OpenCode Zens Models

| Model | Speed | Quality | Context | Reasoning | Multimodal | Cost |
|-------|-------|---------|---------|-----------|------------|------|
| **minimax-m2.1** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Large | ⭐⭐⭐⭐⭐ | ❌ | FREE* |
| **glm-4.7** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Large | ⭐⭐⭐⭐⭐ | ❌ | FREE* |

**Best Use Cases:**
- minimax-m2.1: Code generation, full-stack development, complex refactoring
- glm-4.7: Multi-step reasoning, planning, research, mathematical problems

---

### Google Gemini Models

| Model | Speed | Quality | Context | Reasoning | Multimodal | Cost |
|-------|-------|---------|---------|-----------|------------|------|
| **gemini-3-pro** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 1M tokens | ⭐⭐⭐⭐⭐ | ✅ All | FREE |
| **gemini-3-pro-high** | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 1M tokens | ⭐⭐⭐⭐⭐ | ✅ All | FREE |
| **gemini-3-flash** | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 1M tokens | ⭐⭐⭐⭐ | ✅ All | FREE |
| **gemini-3-flash-high** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 1M tokens | ⭐⭐⭐⭐⭐ | ✅ All | FREE |
| **gemini-2.5-flash** | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ | 1M tokens | ⭐⭐⭐ | ✅ All | FREE |

**Best Use Cases:**
- gemini-3-pro: Complex coding, architecture, multimodal analysis
- gemini-3-pro-high: Deep research, complex reasoning, planning
- gemini-3-flash: Fast iterations, simple tasks, knowledge building
- gemini-3-flash-high: Balanced speed/quality for planning
- gemini-2.5-flash: Lightweight tasks, quick responses

**Multimodal:** Supports text, image, video, audio, PDF inputs

---

### GitHub Copilot Models

| Model | Speed | Quality | Context | Reasoning | Multimodal | Cost |
|-------|-------|---------|---------|-----------|------------|------|
| **gpt-5.1-codex** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 128K | ⭐⭐⭐⭐ | ❌ | $$$$ |
| **claude-haiku-4.5** | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | 200K | ⭐⭐⭐⭐ | ✅ Limited | $$ |
| **claude-sonnet-4.5** | ⚡⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 200K | ⭐⭐⭐⭐⭐ | ✅ Limited | $$$$ |
| **claude-opus-4.5** | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | 200K | ⭐⭐⭐⭐⭐ | ✅ Limited | $$$$$ |

**Best Use Cases:**
- gpt-5.1-codex: Code implementation, debugging, code-specific tasks
- claude-haiku-4.5: Fast planning, quick iterations, cheap operations
- claude-sonnet-4.5: Balanced tasks, complex coding, full development
- claude-opus-4.5: Research-heavy tasks, deep analysis (use sparingly - expensive!)

**Note:** Claude models via GitHub Copilot may have different behavior than direct Anthropic API

---

### OpenCode Grok Model

| Model | Speed | Quality | Context | Reasoning | Multimodal | Cost |
|-------|-------|---------|---------|-----------|------------|------|
| **grok-codefast-2** | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ | Medium | ⭐⭐⭐ | ❌ | FREE |

**Best Use Cases:**
- Emergency fallback when other providers unavailable
- Simple, fast iterations
- Testing OpenCode setup
- Low-stakes experimentation

---

## Agent-to-Model Mapping Rationale

### Build Agent
**Purpose:** Full-featured development work  
**Requirements:** Best code generation, handles complexity, good at refactoring

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | minimax-m2.1 | Code-optimized, strong reasoning, free |
| gemini | gemini-3-pro | Multimodal (can see images/diagrams), excellent quality |
| copilot | gpt-5.1-codex | Code-specialized, best for implementation |
| grok | grok-codefast-2 | Fast fallback |

---

### Plan Agent
**Purpose:** Analysis and planning without modifications  
**Requirements:** Fast reasoning, structured thinking, low cost preferred

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | glm-4.7 | Multi-step reasoning, free |
| gemini | gemini-3-flash-high | Fast + high thinking capability |
| copilot | claude-haiku-4.5 | Cheap, fast, good enough for planning |
| grok | grok-codefast-2 | Fast fallback |

---

### Code Agent
**Purpose:** Code-focused development with GitHub integration  
**Requirements:** Best code understanding, implementation skills

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | minimax-m2.1 | Code-optimized, agentic workflows |
| gemini | gemini-3-pro | High quality, large context |
| copilot | gpt-5.1-codex | Specialized for code |
| grok | grok-codefast-2 | Fast fallback |

---

### Research Agent
**Purpose:** Deep documentation and information gathering  
**Requirements:** Access to MCP tools, deep reasoning, multimodal preferred

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | glm-4.7 | Strong reasoning, free |
| gemini | gemini-3-pro-high | High thinking + multimodal + huge context |
| copilot | claude-opus-4.5 | Absolute best quality (expensive!) |
| grok | grok-codefast-2 | Fast fallback |

---

### Thinking Agent
**Purpose:** Structured reasoning and memory  
**Requirements:** Sequential thinking, low cost, no file modifications needed

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | glm-4.7 | Multi-step reasoning specialist |
| gemini | gemini-3-pro-high | High thinking capability |
| copilot | claude-haiku-4.5 | Cheap for simple reasoning |
| grok | grok-codefast-2 | Fast fallback |

---

### Deep Agent
**Purpose:** Analyze-first builder with balanced agency  
**Requirements:** Analysis + action, complex understanding

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | minimax-m2.1 | Balanced code + reasoning |
| gemini | gemini-3-pro | Excellent balance |
| copilot | claude-sonnet-4.5 | Balanced Claude model |
| grok | grok-codefast-2 | Fast fallback |

---

### Know Agent
**Purpose:** Knowledge building and documentation  
**Requirements:** Fast, cheap, write-only (no edits)

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | glm-4.7 | Good reasoning, free |
| gemini | gemini-3-flash | Fast, cheap, good enough |
| copilot | claude-haiku-4.5 | Cheap, fast |
| grok | grok-codefast-2 | Fast fallback |

---

### OpenCode-Config-Manager Agent
**Purpose:** Expert in OpenCode configuration  
**Requirements:** Precision, technical accuracy, config expertise

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | minimax-m2.1 | Code-focused, precise |
| gemini | gemini-3-flash | Fast, good for config work |
| copilot | gpt-5.1-codex | Code-specialized |
| grok | grok-codefast-2 | Fast fallback |

---

### Hiker Agent (Cyber Security Lab)
**Purpose:** Offensive/defensive security research  
**Requirements:** Deep analysis, security knowledge, research tools

| Profile | Model | Rationale |
|---------|-------|-----------|
| zens | glm-4.7 | Research + reasoning |
| gemini | gemini-3-flash | Fast research iterations |
| copilot | claude-haiku-4.5 | Cheap for security research |
| grok | grok-codefast-2 | Fast fallback |

---

## Cost Estimation (Monthly)

### Zens Profile
- **minimax-m2.1:** FREE (during promo)
- **glm-4.7:** FREE (during promo)
- **Total:** $0/month*

\* *Subject to change when promotional period ends*

---

### Gemini Profile
- **All models:** FREE (Google AI Studio)
- **Rate limits:** Generous for personal/dev use
- **Total:** $0/month

**Note:** Google may implement paid tiers in the future

---

### Copilot Profile
- **Subscription:** $10-20/month (GitHub Copilot Individual/Business)
- **Usage:** Included in subscription (no per-token costs visible to user)
- **Total:** $10-20/month (fixed)

**Note:** Actual costs depend on GitHub Copilot plan

---

### Grok Profile
- **grok-codefast-2:** FREE
- **Rate limits:** May exist but generous
- **Total:** $0/month

---

## Performance Benchmarks (Subjective)

### Code Generation Quality

```
1. minimax-m2.1     ⭐⭐⭐⭐⭐
2. gpt-5.1-codex    ⭐⭐⭐⭐⭐
3. gemini-3-pro     ⭐⭐⭐⭐⭐
4. claude-sonnet    ⭐⭐⭐⭐⭐
5. glm-4.7          ⭐⭐⭐⭐
6. claude-haiku     ⭐⭐⭐⭐
7. gemini-3-flash   ⭐⭐⭐⭐
8. grok-codefast-2  ⭐⭐⭐
```

---

### Reasoning Ability

```
1. claude-opus      ⭐⭐⭐⭐⭐
2. glm-4.7          ⭐⭐⭐⭐⭐
3. gemini-3-pro-high ⭐⭐⭐⭐⭐
4. minimax-m2.1     ⭐⭐⭐⭐⭐
5. claude-sonnet    ⭐⭐⭐⭐
6. gemini-3-pro     ⭐⭐⭐⭐
7. gpt-5.1-codex    ⭐⭐⭐⭐
8. claude-haiku     ⭐⭐⭐⭐
9. gemini-3-flash   ⭐⭐⭐
10. grok-codefast-2 ⭐⭐⭐
```

---

### Response Speed

```
1. grok-codefast-2  ⚡⚡⚡⚡⚡
2. gemini-3-flash   ⚡⚡⚡⚡⚡
3. claude-haiku     ⚡⚡⚡⚡⚡
4. gemini-2.5-flash ⚡⚡⚡⚡⚡
5. minimax-m2.1     ⚡⚡⚡⚡
6. glm-4.7          ⚡⚡⚡⚡
7. gemini-3-pro     ⚡⚡⚡⚡
8. gpt-5.1-codex    ⚡⚡⚡⚡
9. claude-sonnet    ⚡⚡⚡⚡
10. gemini-3-pro-high ⚡⚡⚡
11. claude-opus     ⚡⚡⚡
```

---

### Context Window Size

```
1. gemini-3-pro     1,000,000 tokens
2. gemini-3-flash   1,048,576 tokens
3. gemini-2.5-flash 1,048,576 tokens
4. claude-opus      200,000 tokens
5. claude-sonnet    200,000 tokens
6. claude-haiku     200,000 tokens
7. gpt-5.1-codex    128,000 tokens
8. minimax-m2.1     ~100,000 tokens (estimated)
9. glm-4.7          ~100,000 tokens (estimated)
10. grok-codefast-2 ~32,000 tokens (estimated)
```

---

## Switching Decision Tree

```
START
  │
  ├─ Need absolute best quality?
  │    YES → switch:copilot (Claude Opus for research)
  │    NO  → Continue
  │
  ├─ Need multimodal (image/video/audio)?
  │    YES → switch:gemini
  │    NO  → Continue
  │
  ├─ Optimizing for cost?
  │    YES → switch:zens (or gemini if Zens promo ends)
  │    NO  → Continue
  │
  ├─ Need huge context (1M+ tokens)?
  │    YES → switch:gemini
  │    NO  → Continue
  │
  ├─ Primarily code generation?
  │    YES → switch:zens (minimax-m2.1 excellent)
  │    NO  → Continue
  │
  ├─ Need fastest possible responses?
  │    YES → switch:grok
  │    NO  → switch:zens (balanced default)
  │
END
```

---

## Quick Commands

```bash
# Check current profile
cat ~/.config/opencode/opencode.json | grep '"model"' | head -1

# Validate profiles
npm run validate

# Switch profiles
npm run switch:zens      # PRIMARY
npm run switch:gemini    # SECONDARY  
npm run switch:copilot   # TERTIARY
npm run switch:grok      # FALLBACK

# Test current profile
opencode
# Try: "Create a Python function for fibonacci"
# Check footer to see which model responds
```

---

## Related Documentation

- `docs/PROVIDER_PRIORITY_MANAGEMENT.md` - How to change priorities
- `docs/OPENCODE_ZENS_SETUP.md` - Zens connection guide
- `AGENTS.md` - Agent rules and current hierarchy
- `profiles.json` - Source of truth for profiles

---

**Maintained by:** opencode-config-manager agent  
**Last Benchmark:** 2026-01-03 (subjective, based on initial testing)
