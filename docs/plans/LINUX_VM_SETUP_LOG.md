# Linux VM Setup Log - OpenCode Configuration Intelligence

**Date:** 2026-01-05
**Session:** Initial Configuration Test
**Machine:** Linux VM (Server)
**Status:** 🟢 COMPLETE ✅

---

## Session Goal

Configure current Linux VM to use the OpenCode Configuration Intelligence System with proper machine detection and platform-specific paths.

---

## Step-by-Step Log

### Step 1: Environment Check ✅
- Working directory: `/home/dsi/.config/opencode`
- Platform: `linux`
- Git repository: Yes
- Date: 2026-01-05

### Step 2: Reading Master Plan ✅
- Read `docs/plans/CONFIG_INTELLIGENCE_MASTERPLAN.md`
- Status: Phase 3.5 COMPLETE, Phase 3.6 IN PROGRESS
- Approach: Template-based configuration system

### Step 3: Analyzing Existing Configuration ✅
- **machines.json** contains 2 profiles:
  - `macos-fabio` (active, macOS, user: fabiofalopes)
  - `linux-fabio` (Linux, user: fabio)
- **Issue**: Current Linux VM has user `dsi`, not `fabio`
- **Action needed**: Create new profile `linux-vm` or `linux-dsi` with correct paths

### Step 4: Reading Setup Guide ✅
- Followed `docs/MACHINE_SETUP.md`
- Clear process for adding new machine
- Commands documented for initialization

### Step 5: Machine Detection ✅
- **Hostname**: `zabbix`
- **Platform**: `linux`
- **User**: `dsi` (home: `/home/dsi`)
- **Issue**: Node.js/npm not in PATH (cannot run npm scripts)
- **Workaround**: Will proceed manually with JSON edits

### Step 6: Analyzing Machine Profile Needs ✅
- Existing `linux-fabio` profile doesn't match this machine:
  - hostname: `fabio-linux` vs current `zabbix`
  - user: `fabio` vs current `dsi`
- **Decision**: Create new profile `linux-vm` for this server

### Step 7: Created Machine Profile ✅
- **Profile name**: `linux-vm`
- **Hostname**: `zabbix`
- **Platform**: `linux`
- **User**: `dsi`
- **Paths configured**:
  - `mcp-memory`: `/home/dsi/mcp-memory`
  - `mcp-code`: `/home/dsi/mcp-code`
  - `arxiv-papers`: `/home/dsi/arxiv-papers`
  - `obsidian-vault`: `/home/dsi/Documents/Obsidian`
- **Active machine**: Set to `linux-vm` in `_active` field

### Step 8: Generated opencode.json ✅
- Copied template to `opencode.json`
- Replaced all placeholders with Linux VM paths:
  - `{machine:mcp-code}` → `/home/dsi/mcp-code` ✅
  - `{machine:mcp-memory}` → `/home/dsi/mcp-memory` ✅
  - `{machine:arxiv-papers}` → `/home/dsi/arxiv-papers` ✅
- Verified replacements in generated file

### Step 9: Created Required Directories ✅
All MCP directories created successfully:
- `/home/dsi/mcp-memory` ✅
- `/home/dsi/mcp-code` ✅
- `/home/dsi/arxiv-papers` ✅
- `/home/dsi/Documents/Obsidian` ✅

### Step 10: Validation ✅
- `opencode.json` is valid JSON ✅
- Top-level structure verified ✅
- `opencode.json` is gitignored ✅
- All paths correctly resolved for Linux VM ✅

### Step 11: Node.js & Dependencies Installation ✅
- **Issue**: Node.js/npm not in PATH initially
- **Solution**: Installed nvm (no sudo required)
- **Installed**:
  - Node.js v22.21.1 ✅
  - npm v10.9.4 ✅
  - All npm dependencies ✅

### Step 12: Script Validation ✅
- `npm run detect:machine` ✅
  - Correctly detected `linux-vm` profile
  - Platform: `linux`, Hostname: `zabbix`
- `npm run init:machine` ✅
  - Generated `opencode.json` from template
  - Resolved all machine placeholders correctly
  - Paths verified: `/home/dsi/*`
- `npm run validate` ✅
  - All profiles validated
  - 4 profiles (zens, gemini, copilot, grok)
  - All use approved providers
- `npm run validate:agents` ✅
  - 12 agent files validated
  - All passed

### Step 13: Documentation Updates ✅
- Updated `docs/MACHINE_SETUP.md`:
  - Added Node.js installation section (nvm + system options)
  - Added Linux VM troubleshooting guide
  - Added Docker setup instructions for servers

---

## Summary

---

## Issues Encountered

### ⚠️ Issue: Profile Switching Reverts Paths

**Problem**: When switching model profiles (e.g., `npm run switch:gemini`), the generated `opencode.json` reverts to the template's default paths (fabio's paths) instead of the machine-specific paths.

**Cause**: The profile switching script regenerates `opencode.json` from `opencode.base.json` without running the machine profile resolution step.

**Workaround**: After switching profiles, run:
```bash
npm run init:machine
```

This reapplies the machine-specific paths from `linux-vm` profile.

**Future Fix**: The profile switching script should call the machine initialization step automatically after generating config.

---

## Notes & Observations

*(Notes will be added as we proceed)*

---

## Decisions Made

*(Decisions will be logged here)*

---

## Summary

✅ **Linux VM Configuration Complete & Validated!**

The OpenCode Configuration Intelligence System has been successfully configured and fully validated for this Linux VM server:

### What Was Done
1. ✅ Created new machine profile `linux-vm` in `machines.json`
2. ✅ Set correct paths for user `dsi` (not `fabio`)
3. ✅ Generated `opencode.json` from template with Linux-specific paths
4. ✅ Created all required MCP directories
5. ✅ Installed Node.js v22.21.1 and npm v10.9.4 via nvm
6. ✅ Installed all npm dependencies
7. ✅ Validated all configuration files and scripts
8. ✅ Updated documentation

### Configuration Details
- **Machine ID**: `linux-vm`
- **Hostname**: `zabbix`
- **Platform**: `linux`
- **Home Directory**: `/home/dsi`
- **Active**: Yes (set as `_active` in machines.json)
- **Node.js**: v22.21.1 (via nvm)
- **npm**: v10.9.4

### Files Modified
- `machines.json` - Added `linux-vm` profile, set as active
- `opencode.json` - Generated from template (gitignored)
- `docs/MACHINE_SETUP.md` - Added Node.js installation & Linux VM troubleshooting

### Directories Created
- `~/mcp-memory` - Memory MCP data
- `~/mcp-code` - Code interpreter workspace
- `~/arxiv-papers` - Research paper storage
- `~/Documents/Obsidian` - Obsidian vault

### Validation Results
- ✅ `opencode.json` valid JSON
- ✅ Machine detection works (`npm run detect:machine`)
- ✅ Config generation works (`npm run init:machine`)
- ✅ Profile validation passed (4 profiles, all approved)
- ✅ Agent validation passed (12 agents, all valid)
- ✅ All npm dependencies installed (0 vulnerabilities)
- ✅ Post-install script successful

### Next Steps (Optional)

**1. Restart OpenCode to load new configuration**
- Close and reopen OpenCode TUI to reload config

**2. Verify Docker is running** (required for MCP servers)
```bash
sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker
```

**3. Test MCP servers**
- OpenCode TUI → Connect to verify MCP servers start correctly
- Test: `memory`, `code_interpreter`, `sequential_thinking`, etc.

**4. Set up git hooks for auto-refresh** (optional)
```bash
npm run setup:hooks
```
This will automatically regenerate `opencode.json` after git pulls.

**5. Test model switching** (optional)
```bash
npm run switch:zens     # OpenCode Zens (FREE, primary)
npm run switch:gemini   # Google Gemini (FREE, secondary)
npm run switch:copilot   # GitHub Copilot (paid, tertiary)
npm run switch:grok      # OpenCode Grok (FREE, fallback)
```

### Regeneration After Git Pull

**Automatic (if hooks enabled):**
```bash
git pull  # Hooks will run automatically
```

**Manual:**
```bash
git pull
npm run init:machine
```

**Or use refresh command:**
```bash
npm run refresh
```

---

## Testing Commands

Use these commands to verify everything works:

```bash
# Check Node.js and npm
node --version
npm --version

# Detect machine
npm run detect:machine

# Regenerate config
npm run init:machine

# Validate profiles
npm run validate

# Validate agents
npm run validate:agents

# Test all npm scripts
npm run  # (shows all available scripts)
```

---

## Success Criteria

- [x] Machine correctly detected
- [x] Profile created/updated in `machines.json`
- [x] `opencode.json` generated from template
- [x] All paths are Linux-specific (correct)
- [x] MCP servers configured correctly
- [x] Configuration validated successfully

---

## Final Test Results ✅

**Comprehensive Test Suite - All Passed:**

1. ✅ **Node.js/npm Installation**
   - Node.js: v22.21.1
   - npm: v10.9.4

2. ✅ **Machine Detection**
   - Platform: linux
   - Hostname: zabbix
   - Detected: linux-vm

3. ✅ **Config Validation**
   - 12 agents found
   - All profiles valid
   - Approved providers confirmed

4. ✅ **Agent Validation**
   - 12 agents passed
   - 0 agents failed
   - Validation SUCCESS

5. ✅ **Path Resolution**
   - 3 `/home/dsi` paths found
   - All machine-specific paths correct

6. ✅ **Directory Structure**
   - ~/arxiv-papers ✓
   - ~/Documents ✓
   - ~/mcp-code ✓
   - ~/mcp-memory ✓

**Status**: 🟢 **All Systems Operational**

---

