# Machine Setup Guide

This guide helps you configure OpenCode for your specific machine. The multi-machine system lets you sync your configuration across different computers while keeping machine-specific paths (like home directories) correct on each one.

## Why This System Exists

Your OpenCode configuration includes paths to local directories:

- `~/mcp-memory` - Where the memory MCP stores its knowledge graph
- `~/mcp-code` - Where the code interpreter runs Python
- `~/arxiv-papers` - Where downloaded research papers are saved

The problem: `/Users/fabio` on your Mac is `/home/fabio` on Linux. If you sync your config with git, it breaks on different machines.

The solution: A template system with machine profiles. Your `opencode.json` is generated from a template, replacing placeholders like `{machine:mcp-memory}` with the correct path for your current machine.

---

## Prerequisites: Node.js and npm

The configuration scripts require Node.js and npm. If they're not installed:

### Option 1: Using nvm (Recommended, No Sudo Required)

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell or run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 22 LTS
nvm install 22
nvm use 22

# Verify installation
node --version  # Should show v22.x.x
npm --version   # Should show 10.x.x
```

**To make nvm permanent**, add to your shell configuration:
```bash
# Add to ~/.bashrc or ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Option 2: System-wide Installation (Requires Sudo)

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

**After installing Node.js:**

```bash
# Navigate to config directory
cd ~/.config/opencode

# Install dependencies
npm install
```

---

---

## I'm Using macOS

### Quick Start

1. **Run the initialization command:**

   ```bash
   npm run init:machine:macos
   ```

   Or explicitly specify the machine:

   ```bash
   npm run init:machine -- --machine=macos-fabio
   ```

2. **Verify the paths were set correctly:**

   Check that `opencode.json` now has your Mac paths:
   
   ```bash
   grep -A2 "mcp-memory" opencode.json
   ```

   You should see:
   ```
   "/Users/fabiofalopes/mcp-memory:/data"
   ```

### Expected Paths (macOS)

| Directory | Path |
|-----------|------|
| Home | `/Users/fabiofalopes` |
| MCP Memory | `/Users/fabiofalopes/mcp-memory` |
| MCP Code | `/Users/fabiofalopes/mcp-code` |
| arXiv Papers | `/Users/fabiofalopes/arxiv-papers` |
| Obsidian Vault | `/Users/fabiofalopes/Documents/Obsidian` |

### Creating Directories

If the directories don't exist yet:

```bash
mkdir -p ~/mcp-memory ~/mcp-code ~/arxiv-papers
```

---

## I'm Using Linux

### Quick Start

1. **Run the initialization command:**

   ```bash
   npm run init:machine:linux
   ```

   Or explicitly specify the machine:

   ```bash
   npm run init:machine -- --machine=linux-fabio
   ```

2. **Verify the paths were set correctly:**

   ```bash
   grep -A2 "mcp-memory" opencode.json
   ```

   You should see:
   ```
   "/home/fabio/mcp-memory:/data"
   ```

### Expected Paths (Linux)

| Directory | Path |
|-----------|------|
| Home | `/home/fabio` |
| MCP Memory | `/home/fabio/mcp-memory` |
| MCP Code | `/home/fabio/mcp-code` |
| arXiv Papers | `/home/fabio/arxiv-papers` |
| Obsidian Vault | `/home/fabio/Documents/Obsidian` |

### Creating Directories

If the directories don't exist yet:

```bash
mkdir -p ~/mcp-memory ~/mcp-code ~/arxiv-papers
```

---

## Adding a New Machine

To add a new machine (like a work laptop or server), edit `machines.json`:

### Step 1: Identify Your Machine

Run the detection script:

```bash
npm run detect:machine
```

This shows your current platform and hostname.

### Step 2: Add the Profile

Open `machines.json` and add a new entry:

```json
{
  "work-macbook": {
    "platform": "darwin",
    "hostname": "Work-MacBook-Pro",
    "description": "Work laptop",
    "paths": {
      "home": "/Users/john",
      "mcp-memory": "/Users/john/mcp-memory",
      "mcp-code": "/Users/john/mcp-code",
      "arxiv-papers": "/Users/john/arxiv-papers",
      "obsidian-vault": "/Users/john/Documents/Obsidian"
    },
    "mcps": {
      "memory": true,
      "code_interpreter": true,
      "obsidian": false,
      "github": false
    }
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `platform` | `"darwin"` or `"linux"` | Operating system |
| `hostname` | string | Machine hostname (from `hostname` command) |
| `description` | string | Human-readable description |
| `paths` | object | Machine-specific directory paths |
| `mcps` | object | Which MCP servers to enable |

### Step 3: Initialize

Run the initialization with your new machine name:

```bash
npm run init:machine -- --machine=work-macbook
```

### Step 4: Auto-Detect (Optional)

To set this as the active machine and enable auto-detection:

```bash
npm run detect:machine:set
```

This updates `_active` in `machines.json` to match your current hostname.

---

## How It Works

The system uses three files:

```
opencode.template.json  →  Template with placeholders
        +
machines.json           →  Machine profiles with actual paths
        ↓
npm run init:machine
        ↓
opencode.json           →  Generated config (git-ignored)
```

### The Template (`opencode.template.json`)

Contains placeholders like:

```json
{
  "mcp": {
    "memory": {
      "command": [
        "docker", "run", "-v",
        "{machine:mcp-memory}:/data",
        "mcp/memory"
      ]
    }
  }
}
```

### Machine Profiles (`machines.json`)

Contains the actual paths for each machine:

```json
{
  "macos-fabio": {
    "paths": {
      "mcp-memory": "/Users/fabiofalopes/mcp-memory"
    }
  },
  "linux-fabio": {
    "paths": {
      "mcp-memory": "/home/fabio/mcp-memory"
    }
  }
}
```

### The Generated Config (`opencode.json`)

After running `npm run init:machine`, placeholders are replaced:

```json
{
  "mcp": {
    "memory": {
      "command": [
        "docker", "run", "-v",
        "/Users/fabiofalopes/mcp-memory:/data",
        "mcp/memory"
      ]
    }
  }
}
```

---

## After Git Pull

**Important:** After pulling changes to this repository, always re-run the machine initialization:

```bash
git pull
npm run init:machine
```

This regenerates `opencode.json` with any template changes while keeping your machine-specific paths.

If you use a shortcut, the macOS and Linux commands work too:

```bash
npm run init:machine:macos   # For Mac
npm run init:machine:linux   # For Linux
```

---

## Troubleshooting

### "Machine not found" Error

Make sure the machine name matches exactly in `machines.json`:

```bash
# Check available machines
cat machines.json | grep -E '"[a-z]+-[a-z]+":' 
```

### Paths Not Replaced

Check that your placeholders use the correct format:

- ✅ `{machine:mcp-memory}` - Correct
- ❌ `{machine.mcp-memory}` - Wrong (uses dot)
- ❌ `${machine:mcp-memory}` - Wrong (has dollar sign)

### MCP Server Not Starting

1. Check if Docker is running
2. Verify the directory exists:
   ```bash
   ls -la ~/mcp-memory
   ```
3. Check permissions:
   ```bash
   ls -la ~ | grep mcp
   ```

### opencode.json Has Wrong Paths

Regenerate it:

```bash
npm run init:machine -- --machine=YOUR_MACHINE_NAME
```

### Linux VM / Server Setup

If you're setting up OpenCode on a Linux VM or server:

1. **Check Node.js is available:**
   ```bash
   node --version
   npm --version
   ```

2. **If not installed, use nvm (no sudo required):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   nvm install 22
   nvm use 22
   ```

3. **Create machine profile in `machines.json`:**
   ```json
   {
     "linux-vm": {
       "platform": "linux",
       "hostname": "your-server-hostname",
       "description": "Your Linux VM/Server",
       "paths": {
         "home": "/home/your-username",
         "mcp-memory": "/home/your-username/mcp-memory",
         "mcp-code": "/home/your-username/mcp-code",
         "arxiv-papers": "/home/your-username/arxiv-papers",
         "obsidian-vault": "/home/your-username/Documents/Obsidian"
       },
       "mcps": {
         "memory": true,
         "code_interpreter": true,
         "obsidian": false,
         "github": false
       }
     }
   }
   ```

4. **Initialize configuration:**
   ```bash
   npm run init:machine -- --machine=linux-vm
   ```

5. **Create required directories:**
   ```bash
   mkdir -p ~/mcp-memory ~/mcp-code ~/arxiv-papers ~/Documents/Obsidian
   ```

6. **Verify Docker is running** (required for MCP servers):
   ```bash
   sudo systemctl status docker
   # If not running:
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `npm run detect:machine` | Show current platform and hostname |
| `npm run detect:machine:set` | Set active machine based on hostname |
| `npm run init:machine` | Generate opencode.json for active machine |
| `npm run init:machine:macos` | Generate for macos-fabio profile |
| `npm run init:machine:linux` | Generate for linux-fabio profile |
| `npm run init:machine -- --machine=NAME` | Generate for specific machine |
