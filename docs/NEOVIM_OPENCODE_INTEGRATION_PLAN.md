# Neovim + OpenCode Integration Orchestration Plan

**Status:** Planning Phase  
**Date:** 2026-01-03  
**Priority:** HIGH

---

## Executive Summary

This plan coordinates the integration of `opencode.nvim` with the existing Neovim configuration while simultaneously reclaiming control over OpenCode provider/model selection. The integration must:

1. **Establish provider hierarchy:** OpenCode Zens (primary) → Google (secondary) → GitHub Copilot (tertiary)
2. **Remove forbidden providers:** OpenRouter completely banned
3. **Configure Neovim plugin:** opencode.nvim with tmux provider
4. **Resolve keymap conflicts:** Move `<leader>o` commands to accommodate OpenCode
5. **Enable MCP-aware prompts:** Custom prompts that leverage context7, memory, arxiv, etc.

---

## Phase 1: Provider Control Reclamation (CRITICAL)

### 1.1 Create OpenCode Zens Profile

**Agent Assignment:** opencode-config-manager  
**Model:** google/gemini-3-flash (fast config work)

**Task:**
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
      "opencode-config-manager": "opencode/minimax-m2.1"
    }
  }
}
```

**Deliverables:**
- [ ] Add `zens` profile to `profiles.json`
- [ ] Add `"switch:zens": "ts-node scripts/switch-profile.ts --profile=zens"` to `package.json`
- [ ] Test profile switching: `npm run switch:zens`

**Notes:**
- OpenCode Zens models accessed via `/connect` in OpenCode TUI
- Free during promotional period
- Requires OpenCode Zen API key from https://opencode.ai/zen

---

### 1.2 Update Google Profile

**Agent Assignment:** opencode-config-manager  
**Model:** google/gemini-3-flash

**Task:** Ensure Google profile uses ONLY Google-native models (not Google-hosted Claude).

**Current Issues:**
- `gemini-claude-sonnet-4-5` models should NOT be default
- Focus on `gemini-3-pro`, `gemini-3-flash`, `gemini-2.5-flash`

**Deliverables:**
- [ ] Update `profiles.json` gemini profile to use native Gemini models
- [ ] Remove or mark Claude-via-Google as experimental/optional
- [ ] Document known issue: Google-hosted Claude may have auth issues with antigravity plugin

---

### 1.3 Diversify Copilot Profile

**Agent Assignment:** opencode-config-manager  
**Model:** github-copilot/claude-haiku-4.5 (ironic, but testing it)

**Current State:** All agents use Claude Sonnet 4.5 (expensive).

**Required Changes:**
- `build` → `github-copilot/gpt-5.1-codex` (code-specialized)
- `plan` → `github-copilot/claude-haiku-4.5` (fast, cheap)
- `code` → `github-copilot/gpt-5.1-codex`
- `research` → `github-copilot/claude-opus-4.5` (only heavy task)
- `thinking` → `github-copilot/claude-haiku-4.5`
- `deep` → `github-copilot/claude-sonnet-4.5`
- `know` → `github-copilot/claude-haiku-4.5`
- `opencode-config-manager` → `github-copilot/gpt-5.1-codex`

**Deliverables:**
- [ ] Update Copilot profile in `profiles.json`
- [ ] Test with `npm run switch:copilot`

---

### 1.4 Remove OpenRouter

**Agent Assignment:** opencode-config-manager  
**Model:** google/gemini-3-flash

**Task:**
```bash
# Delete the entire openrouter-free profile
# Remove switch:free script
```

**Deliverables:**
- [ ] Delete `openrouter-free` object from `profiles.json`
- [ ] Remove `switch:free` from `package.json` scripts
- [ ] Add note in AGENTS.md: "OpenRouter is forbidden - use Zens/Google/Copilot only"

---

### 1.5 Document Zens Connection Workflow

**Agent Assignment:** know (documentation agent)  
**Model:** google/gemini-3-flash

**Task:** Create step-by-step guide for connecting OpenCode Zens.

**Content:**
```markdown
# OpenCode Zens Setup

## Prerequisites
- OpenCode CLI installed
- Account at https://opencode.ai/zen

## Steps

1. **Get API Key:**
   ```bash
   # Visit https://opencode.ai/zen
   # Sign in and copy your API key
   ```

2. **Connect in OpenCode:**
   ```bash
   opencode  # Start OpenCode TUI
   /connect  # In the TUI
   # Select "OpenCode Zen" from provider list
   # Paste your API key
   ```

3. **Verify Models:**
   ```bash
   /models  # Should show:
   # - minimax-m2.1
   # - glm-4.7
   # - Others...
   ```

4. **Switch Profile:**
   ```bash
   npm run switch:zens
   ```

## Available Models
- **minimax-m2.1:** Code generation, agentic workflows
- **glm-4.7:** Multi-step reasoning, multilingual
```

**Deliverables:**
- [ ] Create `docs/OPENCODE_ZENS_SETUP.md`
- [ ] Add link to AGENTS.md

---

## Phase 2: Neovim Integration

### 2.1 Install snacks.nvim

**Agent Assignment:** code  
**Model:** github-copilot/gpt-5.1-codex

**Task:** Add snacks.nvim to Neovim lazy.nvim config.

**File:** `/Users/fabiofalopes/.config/nvim/lua/plugins/init.lua`

**Code:**
```lua
-- Add after existing plugins, before closing brace
{
  "folke/snacks.nvim",
  priority = 1000,
  lazy = false,
  opts = {
    input = {},
    picker = {},
    terminal = {},
  },
}
```

**Deliverables:**
- [ ] Add snacks.nvim to plugins
- [ ] Test: `:Lazy sync` in Neovim
- [ ] Verify: `:lua require("snacks").setup()` works

---

### 2.2 Resolve Keymap Conflicts

**Agent Assignment:** code  
**Model:** github-copilot/gpt-5.1-codex

**Current Conflicts:**
- `<leader>o` (new line below) → move to `<leader>no`
- `<leader>O` (new line above) → move to `<leader>nO`

**File:** `/Users/fabiofalopes/.config/nvim/lua/core/keymaps.lua`

**Changes:**
```lua
-- OLD (lines 47-48):
keymap('n', '<leader>o', 'o<ESC>', { silent = true, desc = 'New line below' })
keymap('n', '<leader>O', 'O<ESC>', { silent = true, desc = 'New line above' })

-- NEW:
keymap('n', '<leader>no', 'o<ESC>', { silent = true, desc = 'New line below' })
keymap('n', '<leader>nO', 'O<ESC>', { silent = true, desc = 'New line above' })
```

**Deliverables:**
- [ ] Update keymaps.lua
- [ ] Document in `docs/KEYBINDINGS.md`
- [ ] Test new key combos work

---

### 2.3 Install opencode.nvim

**Agent Assignment:** code  
**Model:** github-copilot/gpt-5.1-codex

**File:** `/Users/fabiofalopes/.config/nvim/lua/plugins/init.lua`

**Code:**
```lua
-- Add after snacks.nvim
{
  "NickvanDyke/opencode.nvim",
  dependencies = {
    "folke/snacks.nvim",
  },
  config = function()
    ---@type opencode.Opts
    vim.g.opencode_opts = {
      provider = {
        enabled = "tmux",  -- Using tmux since you're in tmux panes
        tmux = {
          options = "-h",  -- Horizontal split (side-by-side)
        },
      },
      -- Custom prompts leveraging your MCP servers
      prompts = {
        ask_this = { prompt = "@this: ", ask = true, submit = true },
        research = { prompt = "Use context7 and arxiv to research @this", submit = true },
        security = { prompt = "Review @this for security vulnerabilities", submit = true },
        mcp_analyze = { prompt = "Use all available MCP tools to deeply analyze @this", submit = true },
      },
    }
    
    -- Required for auto-reload on OpenCode edits
    vim.o.autoread = true
    
    -- Keymaps under <leader>o prefix
    local keymap = vim.keymap.set
    
    -- Core functions
    keymap({ "n", "x" }, "<leader>oc", function() 
      require("opencode").ask("@this: ", { submit = true }) 
    end, { desc = "OpenCode: Ask with @this" })
    
    keymap({ "n", "x" }, "<leader>os", function() 
      require("opencode").select() 
    end, { desc = "OpenCode: Select action" })
    
    keymap({ "n", "t" }, "<leader>ot", function() 
      require("opencode").toggle() 
    end, { desc = "OpenCode: Toggle terminal" })
    
    -- Quick prompts
    keymap({ "n", "x" }, "<leader>or", function()
      require("opencode").prompt("review", { submit = true })
    end, { desc = "OpenCode: Review @this" })
    
    keymap({ "n", "x" }, "<leader>of", function()
      require("opencode").prompt("fix", { submit = true })
    end, { desc = "OpenCode: Fix @diagnostics" })
    
    keymap({ "n", "x" }, "<leader>oe", function()
      require("opencode").prompt("explain", { submit = true })
    end, { desc = "OpenCode: Explain @this" })
    
    keymap({ "n", "x" }, "<leader>oi", function()
      require("opencode").prompt("implement", { submit = true })
    end, { desc = "OpenCode: Implement @this" })
    
    -- Operator mode (motion support)
    keymap("n", "go", function() 
      return require("opencode").operator("@this ") 
    end, { expr = true, desc = "OpenCode: Add range" })
    
    keymap("n", "goo", function() 
      return require("opencode").operator("@this ") .. "_" 
    end, { expr = true, desc = "OpenCode: Add line" })
    
    -- Navigation in OpenCode TUI
    keymap("n", "<leader>ou", function() 
      require("opencode").command("session.half.page.up") 
    end, { desc = "OpenCode: Scroll up" })
    
    keymap("n", "<leader>od", function() 
      require("opencode").command("session.half.page.down") 
    end, { desc = "OpenCode: Scroll down" })
  end,
}
```

**Deliverables:**
- [ ] Add plugin config
- [ ] Test: `:Lazy sync`
- [ ] Test: `<leader>ot` to toggle OpenCode
- [ ] Test: `<leader>oc` to ask with context

---

### 2.4 Create MCP-Aware Prompts

**Agent Assignment:** research  
**Model:** google/gemini-3-pro-high (needs reasoning about MCP capabilities)

**Task:** Design prompts that intelligently route to MCP servers.

**Examples:**
```lua
prompts = {
  -- Documentation lookup
  docs_nextjs = { 
    prompt = "Use context7 to find Next.js documentation for @this", 
    submit = true 
  },
  docs_react = { 
    prompt = "Use context7 to find React documentation for @this", 
    submit = true 
  },
  
  -- Research workflows
  paper_search = { 
    prompt = "Use arxiv and paper_search to find research papers about @this", 
    submit = true 
  },
  deep_research = { 
    prompt = "Use sequential_thinking to break down @this, then use context7, arxiv, and duckduckgo to research it comprehensively", 
    submit = true 
  },
  
  -- Code examples
  github_examples = { 
    prompt = "Use gh_grep to find real-world examples of @this from GitHub", 
    submit = true 
  },
  
  -- Memory-aware
  remember = { 
    prompt = "Store @this in memory for future reference", 
    submit = true 
  },
  recall = { 
    prompt = "Search memory for information related to @this", 
    submit = true 
  },
}
```

**Deliverables:**
- [ ] Design 10-15 MCP-aware prompts
- [ ] Add to opencode.nvim config
- [ ] Document in `docs/NEOVIM_OPENCODE_PROMPTS.md`

---

## Phase 3: Testing & Validation

### 3.1 Integration Test Matrix

**Agent Assignment:** build  
**Model:** opencode/minimax-m2.1 (testing the new default!)

**Test Cases:**

| Test | Command | Expected Result |
|------|---------|----------------|
| Toggle OpenCode | `<leader>ot` in Neovim | Tmux pane opens with OpenCode TUI |
| Ask with context | `<leader>oc` | Input dialog appears, @this replaced with current code |
| Select action | `<leader>os` | Picker shows prompts + commands |
| Review code | `<leader>or` | OpenCode reviews current selection |
| Fix diagnostics | `<leader>of` | OpenCode sees LSP errors and suggests fixes |
| Operator mode | `go3j` | Next 3 lines added to OpenCode context |
| Auto-reload | OpenCode edits file | Buffer refreshes automatically |
| MCP prompt | Custom `docs_react` prompt | context7 fetches React docs |
| Model rotation | Switch profiles | OpenCode uses correct models per agent |

**Deliverables:**
- [ ] Run all tests
- [ ] Document results
- [ ] Fix any issues

---

## Phase 4: Documentation

### 4.1 Update AGENTS.md

**Agent Assignment:** know  
**Model:** google/gemini-3-flash

**Add Section:**
```markdown
## Neovim Integration

OpenCode is integrated with Neovim via `opencode.nvim`. Key features:

- **Context sharing:** Send buffer/selection/diagnostics to OpenCode
- **Auto-reload:** Files edited by OpenCode refresh automatically
- **Tmux provider:** OpenCode runs in tmux pane (side-by-side or split)
- **MCP-aware prompts:** Custom prompts trigger specific MCP servers

### Keybindings

- `<leader>oc` - Ask OpenCode with @this context
- `<leader>os` - Select OpenCode action (picker)
- `<leader>ot` - Toggle OpenCode terminal
- `<leader>or` - Review current code
- `<leader>of` - Fix LSP diagnostics
- `<leader>oe` - Explain current code
- `<leader>oi` - Implement stub/TODO
- `go{motion}` - Add motion range to OpenCode
- `goo` - Add current line to OpenCode

### Workflows

See `@docs/NEOVIM_OPENCODE_WORKFLOWS.md`
```

**Deliverables:**
- [ ] Update AGENTS.md
- [ ] Create NEOVIM_OPENCODE_WORKFLOWS.md
- [ ] Add to QUICK_REFERENCE.md

---

## Agent Assignment Summary

| Phase | Agent | Model | Tasks |
|-------|-------|-------|-------|
| 1.1 | opencode-config-manager | google/gemini-3-flash | Create Zens profile |
| 1.2 | opencode-config-manager | google/gemini-3-flash | Update Google profile |
| 1.3 | opencode-config-manager | github-copilot/claude-haiku-4.5 | Diversify Copilot |
| 1.4 | opencode-config-manager | google/gemini-3-flash | Remove OpenRouter |
| 1.5 | know | google/gemini-3-flash | Document Zens setup |
| 2.1 | code | github-copilot/gpt-5.1-codex | Install snacks.nvim |
| 2.2 | code | github-copilot/gpt-5.1-codex | Resolve keymap conflicts |
| 2.3 | code | github-copilot/gpt-5.1-codex | Install opencode.nvim |
| 2.4 | research | google/gemini-3-pro-high | Design MCP prompts |
| 3.1 | build | opencode/minimax-m2.1 | Integration testing |
| 4.1 | know | google/gemini-3-flash | Documentation |

---

## Success Criteria

- [ ] Can switch between Zens/Google/Copilot profiles seamlessly
- [ ] OpenRouter profile completely removed
- [ ] opencode.nvim keybindings work without conflicts
- [ ] OpenCode opens in tmux pane from Neovim
- [ ] Context (@this, @diagnostics, @diff) works
- [ ] MCP prompts trigger correct servers
- [ ] Auto-reload works when OpenCode edits files
- [ ] All tests pass
- [ ] Documentation complete

---

## Known Issues & Mitigations

### Issue: Google-hosted Claude not working
**Mitigation:** Use native Gemini models only, Copilot for Claude

### Issue: OpenCode Zens requires /connect
**Mitigation:** Document setup process, automate where possible

### Issue: Tmux provider needs remote control
**Mitigation:** Ensure tmux is properly configured

---

## Next Steps

1. **Config Manager:** Execute Phase 1 (Provider Control)
2. **Code Agent:** Execute Phase 2 (Neovim Integration)
3. **Research Agent:** Design MCP prompts (Phase 2.4)
4. **Build Agent:** Run integration tests (Phase 3)
5. **Know Agent:** Update documentation (Phase 4)

---

**End of Orchestration Plan**
