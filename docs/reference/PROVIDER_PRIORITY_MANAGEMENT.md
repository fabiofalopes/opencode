# Provider Priority Management Guide

**Purpose:** This document explains how to change provider priorities when your needs, costs, or preferences change in the future.

**Last Updated:** 2026-01-03  
**Current Priority:** Zens → Gemini → Copilot → Grok  

---

## Current Provider Hierarchy

```
1. PRIMARY   → OpenCode Zens  (FREE, minimax-m2.1 & glm-4.7)
2. SECONDARY → Google Gemini  (FREE, native Gemini models)
3. TERTIARY  → GitHub Copilot (PAID, GPT & Claude)
4. FALLBACK  → OpenCode Grok  (FREE, single model)
```

**Rationale for Current Priority:**
- Zens is free and has excellent code-focused models
- Gemini is free and provides multimodal + thinking capabilities
- Copilot is paid but diversified (GPT + Claude)
- Grok is simple fallback when everything else fails

---

## When to Change Priorities

### Scenario 1: Free Tier Ends

**Trigger:** OpenCode Zens starts charging or promotional period ends

**Action:**
1. Evaluate Zens pricing vs. alternatives
2. If too expensive, move Gemini to PRIMARY:
   ```bash
   # Edit profiles.json: reorder so "gemini" is first
   # Update AGENTS.md to reflect new hierarchy
   # Run: npm run switch:gemini
   ```

---

### Scenario 2: Better Free Model Appears

**Trigger:** New provider offers superior free models

**Action:**
1. Add new profile to `profiles.json`:
   ```json
   {
     "newprovider": {
       "description": "New amazing free provider",
       "model": "newprovider/best-model",
       "agents": {
         "build": "newprovider/code-model",
         "plan": "newprovider/fast-model",
         ...
       }
     }
   }
   ```

2. Add switch script to `package.json`:
   ```json
   "switch:newprovider": "npm run validate && ts-node scripts/switch-profile.ts --profile=newprovider"
   ```

3. Update AGENTS.md with new priority order

4. Test: `npm run switch:newprovider`

---

### Scenario 3: Cost Optimization Required

**Trigger:** Budget constraints require minimizing API costs

**Action:**
1. Review current spending (use `ocmonitor` tool)
2. Prioritize free providers:
   ```
   1. Gemini (free)
   2. Zens (free during promo)
   3. Grok (free)
   4. Copilot (expensive - minimize use)
   ```

3. Update default profile in AGENTS.md
4. Switch: `npm run switch:gemini`

---

### Scenario 4: Quality Over Cost

**Trigger:** Need absolute best quality, cost is secondary

**Action:**
1. Prioritize premium models:
   ```
   1. Copilot (Claude Opus for research, Sonnet for build)
   2. Gemini (Pro models for multimodal)
   3. Zens (good but lower quality than Claude)
   4. Grok (fallback)
   ```

2. Edit copilot profile to use more expensive models:
   ```json
   {
     "copilot": {
       "agents": {
         "build": "github-copilot/claude-sonnet-4.5",
         "research": "github-copilot/claude-opus-4.5",
         "code": "github-copilot/gpt-5.1-codex",
         ...
       }
     }
   }
   ```

3. Switch: `npm run switch:copilot`

---

## How to Reorder Profiles in profiles.json

### Current Order (by convention):

```json
{
  "zens": { ... },      // PRIMARY
  "gemini": { ... },    // SECONDARY
  "copilot": { ... },   // TERTIARY
  "grok": { ... }       // FALLBACK
}
```

### To Change Priority:

1. **Physically reorder** the profiles in `profiles.json`:
   ```json
   {
     "gemini": { ... },    // NEW PRIMARY
     "zens": { ... },      // NEW SECONDARY
     "copilot": { ... },   // TERTIARY
     "grok": { ... }       // FALLBACK
   }
   ```

2. **Update descriptions** to reflect new roles:
   ```json
   {
     "gemini": {
       "description": "Primary: Google Gemini (Free, Native Models)",
       ...
     },
     "zens": {
       "description": "Secondary: OpenCode Zens (Free, Code-focused)",
       ...
     }
   }
   ```

3. **Update AGENTS.md** section:
   ```markdown
   **APPROVED PROVIDERS (in priority order):**

   1. **Google Gemini** - Primary (FREE with native models)
   2. **OpenCode Zens** - Secondary (FREE, code-focused)
   3. **GitHub Copilot** - Tertiary (Paid subscription)
   4. **OpenCode Grok** - Fallback (FREE, single model)
   ```

4. **Update npm scripts order** in `package.json` (optional but clean):
   ```json
   "scripts": {
     "validate": "...",
     "switch:gemini": "...",   // PRIMARY listed first
     "switch:zens": "...",     // SECONDARY
     "switch:copilot": "...",  // TERTIARY
     "switch:grok": "..."      // FALLBACK
   }
   ```

5. **Validate and apply:**
   ```bash
   npm run validate          # Check for errors
   npm run switch:gemini     # Switch to new primary
   ```

---

## Agent-to-Model Mapping Strategy

### Current Strategy:

| Agent | Model Selection Logic |
|-------|----------------------|
| **build** | Best code generation model (minimax-m2.1, gemini-3-pro, gpt-5.1-codex) |
| **plan** | Fast reasoning model (glm-4.7, gemini-3-flash-high, claude-haiku-4.5) |
| **code** | Code-specialized (minimax-m2.1, gemini-3-pro, gpt-5.1-codex) |
| **research** | Deep reasoning (glm-4.7, gemini-3-pro-high, claude-opus-4.5) |
| **thinking** | Structured reasoning (glm-4.7, gemini-3-pro-high, claude-haiku-4.5) |
| **deep** | Complex analysis (minimax-m2.1, gemini-3-pro, claude-sonnet-4.5) |
| **know** | Knowledge building (glm-4.7, gemini-3-flash, claude-haiku-4.5) |
| **opencode-config-manager** | Config work (minimax-m2.1, gemini-3-flash, gpt-5.1-codex) |

### Alternative Strategies:

#### 1. **Single Model (Simplicity)**
All agents use the same model (e.g., gemini-3-pro):
```json
{
  "agents": {
    "build": "google/gemini-3-pro",
    "plan": "google/gemini-3-pro",
    "code": "google/gemini-3-pro",
    ...
  }
}
```

**Pros:** Consistent behavior, easy to debug  
**Cons:** Not optimized for each task type  

---

#### 2. **Cost-Optimized (Budget)**
Use cheapest capable model for each task:
```json
{
  "agents": {
    "build": "google/gemini-3-flash",       // Fast & cheap
    "plan": "google/gemini-3-flash",        // Fast & cheap
    "code": "opencode/glm-4.7",             // Free
    "research": "google/gemini-3-pro-high", // Thinking for complex
    ...
  }
}
```

**Pros:** Minimize cost  
**Cons:** May sacrifice quality  

---

#### 3. **Quality-First (Premium)**
Use best model regardless of cost:
```json
{
  "agents": {
    "build": "github-copilot/claude-sonnet-4.5",
    "plan": "github-copilot/claude-opus-4.5",
    "code": "github-copilot/gpt-5.1-codex",
    "research": "github-copilot/claude-opus-4.5",
    ...
  }
}
```

**Pros:** Best quality  
**Cons:** Expensive  

---

#### 4. **Hybrid (Balanced)**
Mix free and paid based on task importance:
```json
{
  "agents": {
    "build": "github-copilot/gpt-5.1-codex",  // PAID - critical
    "plan": "google/gemini-3-flash",          // FREE - less critical
    "code": "github-copilot/gpt-5.1-codex",   // PAID - critical
    "research": "google/gemini-3-pro-high",   // FREE - good enough
    "thinking": "opencode/glm-4.7",           // FREE - reasoning ok
    ...
  }
}
```

**Pros:** Balance cost and quality  
**Cons:** More complex to manage  

---

## Rollback Procedure

### If Profile Switch Breaks Something:

1. **Identify last known good state:**
   ```bash
   git log --oneline opencode.json
   # Find the commit before the switch
   ```

2. **Quick rollback - restore from backup:**
   ```bash
   # OpenCode automatically backs up to opencode.json.backup
   cp opencode.json.backup opencode.json
   ```

3. **Or revert to specific profile:**
   ```bash
   npm run switch:gemini   # Switch to known-good profile
   ```

4. **Manual fix if needed:**
   ```bash
   # Edit opencode.json directly (emergency only)
   nano opencode.json
   # Change "model" field to working model
   # Restart OpenCode
   ```

5. **Investigate issue:**
   ```bash
   npm run validate   # Check for structural problems
   opencode           # Check OpenCode logs
   /models            # Verify models are accessible
   ```

---

## Adding New Providers

### Step-by-Step:

1. **Research provider:**
   - API documentation
   - Model names and IDs
   - Cost structure
   - Authentication method

2. **Test connectivity:**
   ```bash
   opencode
   /connect
   # Try connecting to new provider
   /models
   # Verify models appear
   ```

3. **Add to `opencode.base.json` (if needed):**
   ```json
   {
     "provider": {
       "newprovider": {
         "npm": "@ai-sdk/newprovider",
         "models": {
           "model-name": {
             "id": "actual-api-id",
             "name": "Display Name",
             ...
           }
         }
       }
     }
   }
   ```

4. **Create profile in `profiles.json`:**
   ```json
   {
     "newprofile": {
       "description": "Description of new provider",
       "model": "newprovider/default-model",
       "agents": {
         "build": "newprovider/code-model",
         "plan": "newprovider/fast-model",
         ...
       }
     }
   }
   ```

5. **Add to `ALLOWED_PROVIDERS` in `validate-profiles.ts`:**
   ```typescript
   const ALLOWED_PROVIDERS = {
     'opencode': [...],
     'google': [...],
     'github-copilot': [...],
     'newprovider': ['model1', 'model2', ...],
   };
   ```

6. **Add switch script:**
   ```json
   "switch:newprofile": "npm run validate && ts-node scripts/switch-profile.ts --profile=newprofile"
   ```

7. **Update AGENTS.md:**
   - Add to approved providers list
   - Document setup instructions
   - Update model details section

8. **Test:**
   ```bash
   npm run validate
   npm run switch:newprofile
   opencode
   # Test with a simple task
   ```

---

## Banning Providers

### To Completely Ban a Provider (like OpenRouter):

1. **Remove from `profiles.json`:**
   ```bash
   # Delete the entire profile object
   ```

2. **Remove switch script from `package.json`:**
   ```bash
   # Delete the "switch:badprovider" line
   ```

3. **Add to `FORBIDDEN_PROVIDERS` in `validate-profiles.ts`:**
   ```typescript
   const FORBIDDEN_PROVIDERS = ['openrouter', 'badprovider'];
   ```

4. **Update AGENTS.md:**
   ```markdown
   **FORBIDDEN:** BadProvider is completely banned. Never use BadProvider models.
   ```

5. **Validate:**
   ```bash
   npm run validate
   # Should error if any profile still uses banned provider
   ```

---

## Quick Reference Commands

```bash
# Validation
npm run validate                 # Check profiles.json structure

# Switching
npm run switch:zens              # PRIMARY (current default)
npm run switch:gemini            # SECONDARY
npm run switch:copilot           # TERTIARY
npm run switch:grok              # FALLBACK

# Verification
opencode                         # Start TUI
/models                          # List available models
cat ~/.config/opencode/opencode.json | grep '"model"'  # Check current

# Rollback
cp opencode.json.backup opencode.json   # Emergency restore
npm run switch:gemini                   # Switch to safe default
```

---

## Related Files

- `profiles.json` - Profile definitions
- `opencode.base.json` - Base configuration (provider/model metadata)
- `opencode.json` - Active configuration (generated by switch script)
- `scripts/switch-profile.ts` - Profile switching logic
- `scripts/validate-profiles.ts` - Validation logic
- `AGENTS.md` - Agent rules and current provider hierarchy

---

## Future Considerations

### Potential Changes to Watch:

1. **OpenCode Zens Pricing**
   - Monitor: https://opencode.ai/zen/pricing
   - Plan B: Switch to Gemini if pricing becomes unfavorable

2. **Google Gemini Limits**
   - Monitor: Request quotas/rate limits
   - Plan B: Distribute load across Zens + Copilot

3. **New Free Providers**
   - Keep eye on: OpenAI free tiers, Anthropic offers, new startups
   - Evaluate: Quality, limits, sustainability

4. **Model Improvements**
   - Zens: minimax-m3, glm-5
   - Google: gemini-4-pro
   - GitHub: GPT-6, Claude 5
   - Action: Update profiles when better models available

---

**Maintained by:** opencode-config-manager agent  
**Review:** Quarterly or when provider landscape changes significantly
