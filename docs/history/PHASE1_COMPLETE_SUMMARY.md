# Phase 1 Complete: Provider Control Reclamation

**Status:** ✅ COMPLETE  
**Date:** 2026-01-03  
**Session:** Provider Control & Future-Proofing  

---

## Executive Summary

Phase 1 successfully reclaimed full control over OpenCode provider/model selection, established a clear hierarchy, banned forbidden providers, and created comprehensive systems for future flexibility.

**Key Achievement:** You can now confidently manage, validate, and change provider priorities as your needs evolve.

---

## What Changed

### 1. **Provider Hierarchy Established**

**New Priority Order:**
```
PRIMARY   → OpenCode Zens (FREE - minimax-m2.1, glm-4.7)
SECONDARY → Google Gemini (FREE - native Gemini models)
TERTIARY  → GitHub Copilot (PAID - diversified: GPT + Claude)
FALLBACK  → OpenCode Grok (FREE - single model)
```

**Old State:** Using expensive GitHub Copilot Claude Sonnet 4.5 as default  
**New State:** FREE providers prioritized, Copilot models diversified  

---

### 2. **Files Modified**

| File | Changes | Why |
|------|---------|-----|
| **profiles.json** | • Added `zens` profile<br>• Removed `openrouter-free`<br>• Updated all agent mappings<br>• Reordered by priority | Control provider hierarchy |
| **package.json** | • Added `npm run validate`<br>• Added `switch:zens`<br>• Removed `switch:free`<br>• Auto-validate before switch | Safety + convenience |
| **AGENTS.md** | • Added FORBIDDEN warning<br>• Updated provider hierarchy<br>• Added Zens documentation<br>• Noted Google-Claude issues | Prevent mistakes |
| **opencode.base.json** | • Added warning to `gemini-claude` models | Awareness of auth issues |

---

### 3. **Files Created**

| File | Purpose | Why Critical |
|------|---------|--------------|
| **scripts/validate-profiles.ts** | Validates profiles.json before switching | Prevent breaking changes |
| **docs/OPENCODE_ZENS_SETUP.md** | Step-by-step Zens connection guide | Enable new provider |
| **docs/PROVIDER_PRIORITY_MANAGEMENT.md** | How to change priorities in future | Future flexibility |
| **docs/PROFILE_QUICK_REFERENCE.md** | Model comparison & decision tree | Quick decision-making |
| **docs/NEOVIM_OPENCODE_INTEGRATION_PLAN.md** | Full Phase 2 roadmap | Future session prep |

---

## Why These Changes Matter

### Cost Savings
- **Before:** Using expensive Claude Sonnet 4.5 ($$$) as default
- **After:** FREE Zens/Gemini models as primary, Copilot for specific use cases
- **Impact:** Potentially $100s/month savings (depends on usage)

---

### Quality Maintenance
- **Before:** Single-model approach (all agents use same expensive model)
- **After:** Task-optimized approach (right model for each agent)
- **Impact:** Better results + lower cost

---

### Future-Proofing
- **Before:** Manual JSON editing, no validation, hard to change
- **After:** Profile system + validation + comprehensive docs
- **Impact:** Can adapt when:
  - Zens promo ends
  - Better free models appear
  - Priorities change
  - Providers change pricing

---

### Safety & Control
- **Before:** Could accidentally use forbidden providers
- **After:** Validation catches banned providers, structural errors
- **Impact:** Confidence in making changes

---

## Agent-to-Model Mapping Strategy

### Zens Profile (PRIMARY)
```
build  → minimax-m2.1  (code generation specialist)
plan   → glm-4.7       (multi-step reasoning)
code   → minimax-m2.1  (code specialist)
research → glm-4.7     (deep reasoning)
thinking → glm-4.7     (structured reasoning)
deep   → minimax-m2.1  (complex analysis)
know   → glm-4.7       (knowledge building)
config → minimax-m2.1  (technical precision)
hiker  → glm-4.7       (security research)
```

**Rationale:**
- minimax-m2.1: Heavy code generation tasks
- glm-4.7: Reasoning, planning, research

---

### Gemini Profile (SECONDARY)
```
build  → gemini-3-pro         (multimodal, large context)
plan   → gemini-3-flash-high  (fast + thinking)
code   → gemini-3-pro         (high quality)
research → gemini-3-pro-high  (deep thinking)
thinking → gemini-3-pro-high  (structured reasoning)
deep   → gemini-3-pro         (complex tasks)
know   → gemini-3-flash       (fast knowledge)
config → gemini-3-flash       (quick config)
hiker  → gemini-3-flash       (fast research)
```

**Rationale:**
- gemini-3-pro: Best quality when needed
- gemini-3-flash: Speed for lighter tasks
- -high variants: Maximum thinking capability

---

### Copilot Profile (TERTIARY)
```
build  → gpt-5.1-codex       (code-specialized)
plan   → claude-haiku-4.5    (cheap, fast)
code   → gpt-5.1-codex       (best for code)
research → claude-opus-4.5   (expensive but best)
thinking → claude-haiku-4.5  (cheap for simple reasoning)
deep   → claude-sonnet-4.5   (balanced)
know   → claude-haiku-4.5    (cheap for docs)
config → gpt-5.1-codex       (technical precision)
hiker  → claude-haiku-4.5    (research-lite)
```

**Rationale:**
- Diversified: Not all Claude Sonnet
- Cost-conscious: Haiku for cheaper tasks
- Quality where it matters: Opus for research, GPT for code

---

## Validation System

### What It Checks:
1. ✅ Profile structure (description, model, agents)
2. ✅ Forbidden providers (OpenRouter banned)
3. ✅ Model ID format (provider/model)
4. ✅ Agent names match base config
5. ⚠️  Unknown providers (warnings)
6. ⚠️  Missing agent overrides (warnings)

### How to Use:
```bash
# Validate before manual edits
npm run validate

# Automatic validation before switching
npm run switch:zens   # validates first
npm run switch:gemini # validates first
```

### If Validation Fails:
- **Errors:** Fix immediately (broken structure, forbidden provider)
- **Warnings:** Decide if acceptable (missing agents, unknown provider)

---

## Future Flexibility: How to Change Things

### Scenario 1: Zens Starts Charging
```bash
# Option A: Make Gemini primary
# 1. Edit profiles.json: move "gemini" to top
# 2. Update AGENTS.md: reflect new priority
# 3. Switch: npm run switch:gemini

# Option B: Evaluate pricing and decide
# 1. Check Zens pricing page
# 2. Compare with Copilot cost
# 3. Choose based on budget
```

---

### Scenario 2: New Free Provider Appears
```bash
# 1. Test in OpenCode: /connect → select new provider
# 2. Add to profiles.json:
#    {
#      "newprovider": {
#        "description": "New free provider",
#        "model": "newprovider/best-model",
#        "agents": { ... }
#      }
#    }
# 3. Add to package.json:
#    "switch:newprovider": "npm run validate && ..."
# 4. Update validation script: add to ALLOWED_PROVIDERS
# 5. Update AGENTS.md: new hierarchy
# 6. Test: npm run switch:newprovider
```

---

### Scenario 3: Need Different Agent Mapping
```bash
# Edit profiles.json directly:
{
  "zens": {
    "agents": {
      "build": "opencode/glm-4.7",    # Change from minimax
      "code": "opencode/minimax-m2.1", # Keep same
      ...
    }
  }
}

# Validate: npm run validate
# Apply: npm run switch:zens
```

---

### Scenario 4: Emergency Rollback
```bash
# Quick: use backup
cp opencode.json.backup opencode.json

# Or: switch to known-good profile
npm run switch:gemini

# Or: git revert if tracked
cd ~/.config/opencode
git log --oneline opencode.json
git checkout <commit-hash> opencode.json
```

---

## Documentation Hierarchy

### Quick Start (You need this NOW):
1. **AGENTS.md** - Provider rules, quick commands
2. **docs/PROFILE_QUICK_REFERENCE.md** - Model comparison, decision tree

### Deep Dive (When you need details):
3. **docs/OPENCODE_ZENS_SETUP.md** - Zens connection
4. **docs/PROVIDER_PRIORITY_MANAGEMENT.md** - How to change priorities

### Implementation (For developers):
5. **profiles.json** - Source of truth
6. **scripts/validate-profiles.ts** - Validation logic
7. **scripts/switch-profile.ts** - Switching logic

---

## Testing Checklist (Do This After System Reboot)

```bash
# 1. Validate current state
cd ~/.config/opencode
npm run validate
# Expected: ✅ VALIDATION PASSED

# 2. Connect to OpenCode Zens
opencode
/connect
# Select: OpenCode Zen
# Paste: <your API key from https://opencode.ai/zen>
/models
# Expected: minimax-m2.1, glm-4.7 visible
/quit

# 3. Switch to Zens profile
npm run switch:zens
# Expected: ✅ Successfully generated opencode.json

# 4. Test with OpenCode
opencode
# Try: "Create a Python function for fibonacci"
# Check footer: Should show minimax-m2.1 or glm-4.7
# Verify: Response quality is good
/quit

# 5. Verify other profiles work
npm run switch:gemini
opencode
# Quick test
/quit

npm run switch:copilot
opencode
# Quick test
/quit

# 6. Return to primary
npm run switch:zens
```

---

## Known Issues & Mitigations

### Issue 1: Google-Hosted Claude Auth Problems
**Status:** Known limitation  
**Workaround:** Use native Gemini models or GitHub Copilot for Claude  
**Note:** Added warning to opencode.base.json  

---

### Issue 2: Zens Promotional Period Unknown Duration
**Status:** Monitoring required  
**Workaround:** Prepared to switch to Gemini as primary  
**Action:** Check https://opencode.ai/zen/pricing monthly  

---

### Issue 3: OpenCode.json Gets Overwritten
**Status:** By design (profile system)  
**Workaround:** Edit profiles.json, not opencode.json  
**Note:** Documented in AGENTS.md  

---

## Metrics to Monitor

### Cost Tracking
```bash
# Use ocmonitor to track spending
ocmonitor models           # See which models used most
ocmonitor projects         # Project-level costs
ocmonitor daily --breakdown # Daily usage by model
```

**Watch for:**
- Unexpected Copilot usage (expensive)
- Heavy use of Claude Opus (most expensive)

---

### Quality Tracking
- Subjective: Are responses getting better/worse?
- Compare: Try same prompt on different profiles
- Adjust: If quality drops, switch profiles

---

### Performance Tracking
- Speed: Which profile responds fastest?
- Errors: Any providers frequently failing?
- Rate limits: Hit any limits?

---

## What's Next (Phase 2)

**NOT starting now** - separate session when ready:

1. Install snacks.nvim in Neovim
2. Resolve keymap conflicts
3. Install opencode.nvim with tmux provider
4. Create MCP-aware prompts
5. Full integration testing

**See:** `docs/NEOVIM_OPENCODE_INTEGRATION_PLAN.md`

---

## Success Criteria: Did We Achieve Them?

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Can switch between profiles seamlessly | ✅ | npm scripts + validation |
| OpenRouter completely removed | ✅ | Deleted from profiles.json, banned in validation |
| Future priority changes documented | ✅ | PROVIDER_PRIORITY_MANAGEMENT.md |
| Provider hierarchy clear | ✅ | AGENTS.md, PROFILE_QUICK_REFERENCE.md |
| Validation prevents errors | ✅ | validate-profiles.ts, auto-run before switch |
| Zens connection documented | ✅ | OPENCODE_ZENS_SETUP.md |
| Agent mapping rationale explained | ✅ | PROFILE_QUICK_REFERENCE.md |
| Rollback procedure exists | ✅ | PROVIDER_PRIORITY_MANAGEMENT.md |
| Cost optimization achieved | ✅ | FREE providers primary |
| System is future-proof | ✅ | Comprehensive docs + examples |

**Overall:** ✅ 10/10 COMPLETE

---

## Files Changed Summary

### Modified (5 files):
1. `profiles.json` - Added zens, removed openrouter, updated all mappings
2. `package.json` - Added validate, switch:zens, removed switch:free
3. `AGENTS.md` - Updated provider hierarchy, added warnings
4. `opencode.base.json` - Added Google-Claude warning
5. `~/.config/nvim/lua/core/keymaps.lua` - NOT MODIFIED YET (Phase 2)

### Created (5 files):
1. `scripts/validate-profiles.ts` - Validation logic
2. `docs/OPENCODE_ZENS_SETUP.md` - Zens guide
3. `docs/PROVIDER_PRIORITY_MANAGEMENT.md` - Priority management
4. `docs/PROFILE_QUICK_REFERENCE.md` - Quick comparison
5. `docs/NEOVIM_OPENCODE_INTEGRATION_PLAN.md` - Phase 2 plan

---

## Questions to Verify Understanding

Before testing, can you answer these?

1. **What command switches to the Zens profile?**
   ```bash
   npm run switch:zens
   ```

2. **Which profile is most expensive?**
   ```
   copilot (paid subscription + premium models)
   ```

3. **What model does the 'research' agent use in the zens profile?**
   ```
   glm-4.7 (multi-step reasoning specialist)
   ```

4. **How do you check if profiles.json is valid?**
   ```bash
   npm run validate
   ```

5. **Which provider is completely banned?**
   ```
   OpenRouter
   ```

6. **If Zens starts charging, what's the backup plan?**
   ```
   Switch to gemini profile (also free)
   ```

---

## Final Checklist Before You Test

- [ ] Understand provider hierarchy (Zens → Gemini → Copilot → Grok)
- [ ] Know how to connect to Zens (/connect in OpenCode TUI)
- [ ] Have Zens API key ready (from https://opencode.ai/zen)
- [ ] Understand validation system (npm run validate)
- [ ] Know how to switch profiles (npm run switch:X)
- [ ] Understand rollback (opencode.json.backup or switch to different profile)
- [ ] Read PROFILE_QUICK_REFERENCE.md for model details
- [ ] System rebooted (you mentioned this hasn't happened yet)

---

## Contact Points for Issues

If something breaks:

1. **Validation fails:**
   - Check error messages
   - Fix profiles.json structure
   - See PROVIDER_PRIORITY_MANAGEMENT.md

2. **Switch command fails:**
   - Ensure in ~/.config/opencode
   - Check opencode.base.json exists
   - Verify ts-node installed

3. **Models not appearing:**
   - Re-run /connect in OpenCode
   - Check API key is correct
   - Verify provider is available

4. **Quality issues:**
   - Try different profile
   - Check which model is responding (footer in TUI)
   - Consult PROFILE_QUICK_REFERENCE.md for alternatives

---

**STATUS:** Ready for testing after system reboot  
**NEXT SESSION:** Phase 2 (Neovim Integration) - when you're ready

---

**Maintained by:** opencode-config-manager agent  
**Session Date:** 2026-01-03  
**Duration:** Provider Control Reclamation (Phase 1 ONLY)
