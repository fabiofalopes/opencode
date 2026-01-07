# OpenCode Zens Setup Guide

**Status:** Recommended Primary Provider  
**Cost:** FREE (during promotional period)  
**Models:** minimax-m2.1, glm-4.7  

---

## Overview

OpenCode Zens is an AI gateway providing free access to cutting-edge coding models:
- **Minimax M2.1:** Code generation, agentic workflows, strong reasoning
- **GLM-4.7:** Multi-step reasoning, multilingual coding, advanced programming

Both models are optimized for OpenCode and completely free during the promotional period.

---

## Prerequisites

- OpenCode CLI installed (`which opencode` should work)
- Account at https://opencode.ai/zen
- Internet connection

---

## Setup Steps

### Step 1: Create OpenCode Zen Account

```bash
# Open your browser and visit:
https://opencode.ai/zen

# Sign up or sign in
# Navigate to API Keys section
```

### Step 2: Get Your API Key

1. After logging in, go to the **API Keys** section
2. Click "Create New API Key" or copy existing key
3. **Save this key securely** - you'll need it for the next step

### Step 3: Connect in OpenCode TUI

```bash
# Start OpenCode
opencode

# In the TUI, run the connect command:
/connect

# You'll see a provider selection menu:
# - OpenCode Zen
# - Google
# - GitHub Copilot
# - Anthropic
# - etc.

# Select: OpenCode Zen

# Paste your API key when prompted
```

### Step 4: Verify Connection

```bash
# Still in OpenCode TUI, run:
/models

# You should see:
# ✓ opencode/minimax-m2.1
# ✓ opencode/glm-4.7
# (possibly others)
```

### Step 5: Switch to Zens Profile

```bash
# Exit OpenCode (Ctrl+C or /quit)

# In your terminal, switch to the Zens profile:
cd ~/.config/opencode
npm run switch:zens

# This updates opencode.json to use Zens models for all agents
```

### Step 6: Test the Integration

```bash
# Start OpenCode again
opencode

# Try a coding task:
Create a Python function that calculates fibonacci numbers

# The response should be powered by minimax-m2.1 or glm-4.7
# Check the footer of the TUI to see which model is active
```

---

## Available Models

### minimax-m2.1

**Best for:**
- Code generation
- Agentic workflows (multi-step tasks)
- Complex reasoning
- Large context understanding

**Capabilities:**
- Strong code understanding
- Multi-turn dialogue
- Leading multilingual coding performance
- Long context window

**Use cases:**
- Build agent (full development work)
- Code agent (implementation tasks)
- Deep agent (analyze-first workflows)

---

### glm-4.7

**Best for:**
- Multi-step reasoning
- Multilingual coding
- Planning and analysis
- Research workflows

**Capabilities:**
- Advanced programming capabilities
- Improved multi-step reasoning
- Excellent at breaking down complex problems
- Strong performance on mathematical reasoning

**Use cases:**
- Plan agent (analysis without modifications)
- Research agent (deep analysis)
- Thinking agent (structured reasoning)
- Know agent (knowledge building)

---

## Profile Configuration

The `zens` profile in `profiles.json` maps agents to models:

```json
{
  "zens": {
    "description": "Primary: OpenCode Zens (Free, Unlimited)",
    "model": "opencode/minimax-m2.1",
    "agents": {
      "build": "opencode/minimax-m2.1",
      "plan": "opencode/glm-4.7",
      "code": "opencode/minimax-m2.1",
      "research": "opencode/glm-4.7",
      "thinking": "opencode/glm-4.7",
      "deep": "opencode/minimax-m2.1",
      "know": "opencode/glm-4.7",
      "opencode-config-manager": "opencode/minimax-m2.1",
      "hiker": "opencode/glm-4.7"
    }
  }
}
```

**Strategy:**
- Use **minimax-m2.1** for heavy code generation (build, code, deep)
- Use **glm-4.7** for reasoning and planning (plan, research, thinking, know)

---

## Troubleshooting

### Issue: "Invalid API Key"

**Solution:**
1. Verify you copied the entire key (no spaces)
2. Check that your OpenCode Zen account is active
3. Try generating a new API key

---

### Issue: Models not appearing in `/models`

**Solution:**
1. Ensure you selected "OpenCode Zen" (not "OpenCode Grok")
2. Check your internet connection
3. Try `/connect` again with a fresh key

---

### Issue: "Rate limit exceeded"

**Solution:**
During the free promotional period, this shouldn't happen. If it does:
1. Wait a few minutes
2. Check the OpenCode Zen status page
3. Consider switching to `gemini` profile temporarily: `npm run switch:gemini`

---

### Issue: Profile switch doesn't work

**Solution:**
```bash
# Ensure you're in the right directory
cd ~/.config/opencode

# Check that profiles.json has the zens profile
cat profiles.json | grep -A 15 '"zens"'

# Manually verify package.json has the script
cat package.json | grep "switch:zens"

# Try running the script directly
npx ts-node scripts/switch-profile.ts --profile=zens
```

---

## Data Privacy

**Important:** During the free promotional period, data collected when using these models may be used to improve the models. If this is a concern:
- Use the `gemini` or `copilot` profiles for sensitive code
- Check OpenCode Zen's privacy policy for details
- Consider switching providers after the promo period ends

---

## Cost Monitoring

**Current Status:** FREE (unlimited)

**Future:** Monitor the OpenCode Zen pricing page:
- https://opencode.ai/zen/pricing

When the promo ends, you can:
1. Continue with paid Zens tier (if affordable)
2. Switch to `gemini` profile (also free): `npm run switch:gemini`
3. Switch to `copilot` profile (subscription): `npm run switch:copilot`

---

## Comparison with Other Providers

| Provider | Cost | Models | Quality | Speed |
|----------|------|--------|---------|-------|
| **OpenCode Zens** | FREE | minimax-m2.1, glm-4.7 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ |
| Google Gemini | FREE | gemini-3-pro, gemini-3-flash | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ |
| GitHub Copilot | PAID | GPT-5.1, Claude 4.5 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ |
| OpenCode Grok | FREE | grok-codefast-2 | ⭐⭐⭐ | ⚡⚡⚡⚡⚡ |

**Recommendation:**
- **Primary:** OpenCode Zens (free, excellent quality)
- **Secondary:** Google Gemini (free, multimodal)
- **Tertiary:** GitHub Copilot (paid, diversified)

---

## Next Steps

After setup:
1. Test with a few coding tasks
2. Compare output quality with Gemini/Copilot
3. Choose your default profile based on preference
4. Consider using different profiles for different projects

---

## Related Documentation

- `@docs/MCP_TOOLS.md` - MCP server integration
- `@docs/QUICK_REFERENCE.md` - Quick command reference
- `AGENTS.md` - Agent rules and model configuration

---

**Last Updated:** 2026-01-03  
**Maintained by:** opencode-config-manager agent
