# Research: Dynamic Model Switching in OpenCode

**Date:** December 22, 2025
**Status:** Final Report
**Scope:** Investigation into dynamic model selection strategies for OpenCode agents without manual configuration editing.

## Executive Summary

OpenCode's architecture (v1.0.10+) binds model selection strictly to Agent definitions in `opencode.json`. Native support for dynamic model switching via CLI flags (e.g., `--model gpt-4`) or environment variables (e.g., `OPENCODE_MODEL=...`) is currently absent or undocumented in the public repository and documentation.

However, two robust patterns were identified to achieve your goal of "switching models depending on spending/provider" without manual JSON editing:

1.  **The "Dual-Mode" Strategy (Native):** Defining parallel agents (e.g., `build-fast` vs `build-smart`) in the config.
2.  **The "Profile Switcher" Strategy (System):** Using shell aliases to hot-swap configuration files.

## 1. System Analysis

### The "OpenCode" Architecture
OpenCode is a Go-based Terminal User Interface (TUI) that wraps LLM providers. It relies on a static configuration file (`opencode.json`) to define "Modes" (which map to Agents).

*   **Source of Truth:** `~/.config/opencode/opencode.json`
*   **Model Definition:** Models are defined per-agent or globally.
*   **Limitation:** The CLI initialization process loads this JSON once. There is no built-in "override" mechanism exposed to the end-user at runtime.

### Findings from External Research
*   **Issue #2770 (sst/opencode):** Users have reported that "switching agents doesn't always change the model" if not explicitly configured, highlighting the stickiness of the initial config.
*   **Documentation:** The official docs emphasize editing the config file to change models.
*   **Community Patterns:** Most advanced users utilize separate "Modes" for different cost tiers.

## 2. Solution A: The "Dual-Mode" Strategy (Recommended)

Instead of changing the model of the `build` agent, create two distinct agents optimized for different constraints. This leverages OpenCode's native "Mode" switching capabilities.

**Implementation:**

Modify `opencode.json` to include cost-specific variants:

```json
"agent": {
  "build": {
    "description": "Standard build agent (Sonnet)",
    "model": "github-copilot/claude-sonnet-4.5"
    // ... tools ...
  },
  "build-eco": {
    "description": "Economy build agent (Haiku/Flash)",
    "model": "github-copilot/claude-haiku-4.5",
    "tools": { "context7": true, "gh_grep": true } // Reduced toolset for speed
  },
  "build-pro": {
    "description": "Deep reasoning agent (Opus)",
    "model": "github-copilot/claude-opus-4.5"
  }
}
```

**Usage:**
*   Start with `opencode` -> Select `build-eco` for cheap tasks.
*   Switch mid-session: Type `/mode build-pro` to upgrade intelligence for a hard problem.

**Pros:** Native, no scripts, allows mid-session switching.
**Cons:** Clutters the agent list.

## 3. Solution B: The "Profile Switcher" Strategy

If you prefer to keep your agent list clean (`build`, `plan`, `deep`) but change the *engine* powering them, use file-system level switching.

**Implementation:**

1.  Create `opencode.eco.json` (configured with Haiku/Flash).
2.  Create `opencode.pro.json` (configured with Sonnet/Opus).
3.  Add this function to your shell profile (`.zshrc` / `.bashrc`):

```bash
function opencode-set() {
    CONFIG_DIR="$HOME/.config/opencode"
    TARGET="$CONFIG_DIR/opencode.$1.json"
    
    if [ -f "$TARGET" ]; then
        cp "$TARGET" "$CONFIG_DIR/opencode.json"
        echo "✅ OpenCode switched to '$1' profile."
    else
        echo "❌ Profile '$1' not found. (Expected $TARGET)"
    fi
}
```

**Usage:**
```bash
$ opencode-set eco
$ opencode
> (Runs with Haiku)

$ opencode-set pro
$ opencode
> (Runs with Sonnet)
```

**Pros:** Clean agent list, total configuration isolation.
**Cons:** Requires restarting the session to take effect.

## 4. Conclusion

For your specific need—changing models based on spending/provider—**Solution A (Dual-Mode)** is the most "OpenCode-native" approach. It allows you to make the cost/quality decision *at the moment of the request* (e.g., "This is a hard bug, I'll use `build-pro`") rather than setting a global state.

## References
*   **OpenCode Docs:** `https://opencode.ai/docs/agents/`
*   **GitHub Issues:** `sst/opencode` Issue #2770 (Model switching behavior)
*   **Local Config:** `~/.config/opencode/opencode.json`
