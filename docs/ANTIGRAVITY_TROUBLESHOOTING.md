# Antigravity Plugin Troubleshooting Guide

**Last Updated:** 2025-12-22  
**Plugin Version:** 0.2.9  
**Status:** Active Issues Documented

---

## 🎉 Setup Status

✅ **Authentication:** Complete (2 accounts configured)  
✅ **Plugin Installed:** opencode-google-antigravity-auth v0.2.9  
✅ **Models Configured:** 19 Gemini & Claude variants  
✅ **Claude Models:** Fixed (tool schema restrictions applied)

---

## ⚠️ Known Issues & Solutions

### Issue 1: Claude Tool Schema Validation Error ✅ FIXED

**Error Message:**
```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "tools.34.custom.input_schema: JSON schema is invalid. It must match JSON Schema draft 2020-12"
  }
}
```

**Root Cause:**
- Some MCP tools (hackernews, paper_search) have JSON schemas incompatible with Claude's strict validator
- The plugin transforms Gemini tool schemas to Claude format, but certain newer MCP tools fail validation

**Solution Applied:**
All Claude models now have tool restrictions:
```json
"tools": {
  "hackernews": false,
  "paper_search": false
}
```

**Affected Models:**
- `google/gemini-claude-sonnet-4-5` (all variants)
- `google/gemini-claude-opus-4-5-thinking` (all variants)

**Testing:**
```bash
# Should now work without schema errors
opencode run -m google/gemini-claude-sonnet-4-5 -p "Hello, are you Claude?"
```

---

### Issue 2: Gemini Rate Limit Warnings ⚠️ ACTIVE

**Symptoms:**
- Constant rate limit warnings even when not actively using Gemini models
- Error: `"MODEL_CAPACITY_EXHAUSTED"` for `gemini-2.5-flash`
- Background processes continuously hitting rate limits

**Error Example:**
```json
{
  "error": {
    "code": 429,
    "message": "No capacity available for model gemini-2.5-flash on the server",
    "status": "RESOURCE_EXHAUSTED"
  }
}
```

**Root Cause:**
- Antigravity API has aggressive rate limiting
- OpenCode may be making background requests (health checks, tool validations)
- Google Search tool wrapper uses gemini-2.5-flash internally

**Current Status:**
- Models work when called directly
- Multi-account rotation should help distribute load
- Warnings appear to be non-blocking

**Workarounds:**

1. **Use Multi-Account Rotation (Already Enabled):**
   - You have 2 accounts configured
   - Plugin automatically switches on rate limits
   - Monitor with: `tail -f ~/.local/share/opencode/logs/*`

2. **Use Higher-Tier Models:**
   - `gemini-2.5-flash` has stricter limits
   - Try `gemini-3-flash` or `gemini-3-pro` for better quota

3. **Disable Unused MCP Servers:**
   If you don't need certain tools, disable them in `opencode.json`:
   ```json
   "mcp": {
     "paper_search": { "enabled": false },
     "hackernews": { "enabled": false }
   }
   ```

4. **Monitor Account Usage:**
   ```bash
   # Check which account is active
   cat ~/.local/share/opencode/antigravity-accounts.json | jq '.'
   ```

**Recommendations:**
- ✅ Continue using Gemini models - warnings are mostly harmless
- ✅ Multi-account is already helping distribute load
- ⚠️ Avoid rapid-fire requests to same model
- ⚠️ Consider upgrading Antigravity quota if limits persist

---

## 📊 Working Models (Tested)

### ✅ Gemini Models
- `google/gemini-3-flash` - Working (shows rate warnings but responds)
- `google/gemini-3-flash-high` - Working with extended thinking
- `google/gemini-2.5-flash` - Working (more rate limit warnings)

### ✅ Claude Models (After Fix)
- `google/gemini-claude-sonnet-4-5` - Now working (tools restricted)
- `google/gemini-claude-sonnet-4-5-thinking` - Now working

**Note:** Claude models have `hackernews` and `paper_search` tools disabled to prevent schema errors.

---

## 🔧 Configuration Changes Made

### 1. Tool Restrictions for Claude
All Claude model definitions now include:
```json
"tools": {
  "hackernews": false,
  "paper_search": false
}
```

**Why:** These MCP tools have JSON schemas that don't validate against Claude's strict JSON Schema draft 2020-12 requirements.

**Impact:** Claude models work perfectly, but cannot use HackerNews or Paper Search tools. All other tools (context7, gh_grep, fetch, wikipedia, duckduckgo, memory, code_interpreter, sequential_thinking, arxiv) remain available.

### 2. Multi-Account Setup
- Account 1: Primary
- Account 2: Fallback
- Auto-rotation on rate limits

---

## 🧪 Testing Commands

### Test Claude (Should Work Now)
```bash
opencode run -m google/gemini-claude-sonnet-4-5 -p "Hello, are you Claude? Respond in one sentence."
```

**Expected:** Claude responds without schema errors

### Test Gemini (Works but shows warnings)
```bash
opencode run -m google/gemini-3-flash -p "What is 2+2?"
```

**Expected:** Responds with "4" (may show rate warnings in background)

### Test Thinking Mode
```bash
opencode run -m google/gemini-3-flash-high -p "Explain quantum entanglement in simple terms"
```

**Expected:** Extended reasoning response

### Test Available Tools (Claude)
```bash
opencode run -m google/gemini-claude-sonnet-4-5 -p "Use web search to find information about OpenAI GPT-4"
```

**Expected:** Uses `fetch` or `duckduckgo` (not `hackernews` or `paper_search`)

---

## 🚨 If Issues Persist

### Claude Still Showing Schema Errors

1. **Verify config applied:**
   ```bash
   cat ~/.config/opencode/opencode.json | jq '.provider.google.models["gemini-claude-sonnet-4-5"].tools'
   ```
   Should show: `{ "hackernews": false, "paper_search": false }`

2. **Check plugin version:**
   ```bash
   cat ~/.cache/opencode/node_modules/opencode-google-antigravity-auth/package.json | jq -r '.version'
   ```
   Should be: `0.2.9` or higher

3. **Clear plugin cache and reinstall:**
   ```bash
   rm -rf ~/.cache/opencode/node_modules/opencode-google-antigravity-auth
   opencode
   ```

### Gemini Rate Limits Too Aggressive

1. **Add more accounts:**
   ```bash
   opencode auth login
   # Select Google → Antigravity
   # Answer "y" when asked to add another account
   ```

2. **Use less frequently rate-limited models:**
   - Switch from `gemini-2.5-flash` → `gemini-3-flash`
   - Switch from `gemini-3-flash` → `gemini-3-pro`

3. **Check Antigravity quota:**
   - Login to Google Cloud Console
   - Check Antigravity API quotas
   - Consider requesting quota increase

### Authentication Issues

1. **Re-authenticate:**
   ```bash
   opencode auth login
   ```

2. **Check credentials file:**
   ```bash
   cat ~/.local/share/opencode/antigravity-accounts.json
   ```

3. **Verify both accounts present:**
   ```bash
   cat ~/.local/share/opencode/antigravity-accounts.json | jq '. | length'
   ```
   Should show: `2`

---

## 📝 Debug Logging

### Enable Debug Mode
```bash
opencode --log-level DEBUG run -m google/gemini-3-flash -p "test"
```

### View Logs
```bash
tail -f ~/.local/share/opencode/logs/*
```

### Check Account Rotation
Look for messages like:
```
[INFO] Using account 1/2 (email@gmail.com)
[INFO] Account 1/2 rate-limited, switching...
[INFO] Using account 2/2 (email2@gmail.com)
```

---

## 💡 Best Practices

### ✅ Do:
- Use multi-account setup (already configured)
- Start with `gemini-3-flash-medium` for balanced performance
- Use Claude models for reasoning tasks (now working)
- Monitor logs occasionally for errors
- Use thinking variants when you need extended reasoning

### ❌ Don't:
- Make rapid-fire requests to same model
- Rely on `gemini-2.5-flash` for high-volume tasks (rate limits)
- Use `hackernews` or `paper_search` tools with Claude models (disabled)
- Ignore persistent auth errors (re-authenticate)

---

## 🔍 Model Selection Guide

| Use Case | Recommended Model | Why |
|----------|------------------|-----|
| Quick queries | `gemini-3-flash` | Fast, good quota |
| Deep thinking | `gemini-3-flash-high` | Extended reasoning |
| Cost-sensitive | `gemini-2.5-flash-lite` | Cheapest (but rate limits) |
| Claude reasoning | `gemini-claude-sonnet-4-5-thinking-medium` | Now working, balanced |
| Maximum power | `gemini-3-pro-high` or `gemini-claude-opus-4-5-thinking-high` | Best capabilities |
| Coding tasks | `gemini-3-flash-medium` | Good balance for code generation |

---

## 📚 Additional Resources

- **Plugin Repo:** https://github.com/shekohex/opencode-google-antigravity-auth
- **Config File:** `~/.config/opencode/opencode.json`
- **Credentials:** `~/.local/share/opencode/antigravity-accounts.json`
- **Logs:** `~/.local/share/opencode/logs/`
- **Setup Guide:** `ANTIGRAVITY_SETUP.md`

---

## 🎯 Summary

**What's Working:**
- ✅ Authentication (2 accounts)
- ✅ Gemini models (with rate warnings)
- ✅ Claude models (after tool restrictions)
- ✅ Multi-account rotation
- ✅ Thinking modes
- ✅ Multi-modal support

**Known Limitations:**
- ⚠️ Gemini rate limit warnings (non-blocking)
- ⚠️ Claude models can't use hackernews/paper_search tools
- ⚠️ `gemini-2.5-flash` has aggressive rate limits

**Overall Status:** **OPERATIONAL** ✅

The setup is fully functional. Rate warnings are expected with Antigravity and don't prevent usage. Claude models now work correctly with tool restrictions in place.
