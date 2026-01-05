# OpenCode Monitor - Complete Reference

> Comprehensive monitoring, analytics, and cost tracking for OpenCode AI coding sessions.

## Quick Commands

```bash
# Essential daily commands
ocmonitor sessions              # All session summary
ocmonitor live                  # Real-time dashboard
ocmonitor daily --breakdown     # Today's usage by model
ocmonitor projects              # Project-level analytics

# Quick checks
ocmonitor sessions -l 1         # Current session only
ocmonitor config show           # Verify configuration
```

---

## Installation

### Prerequisites
- Python 3.8+
- pip package manager
- OpenCode installed (`~/.local/share/opencode/`)

### Install

```bash
# Clone and install
cd ~/projetos/hub/ocmonitor-share
pip install -e .

# Verify installation
ocmonitor --version
ocmonitor config show
```

### Configuration

Create `~/.config/ocmonitor/config.toml`:

```toml
[paths]
messages_dir = "~/.local/share/opencode/storage/message"
export_dir = "./exports"

[ui]
table_style = "rich"
progress_bars = true
colors = true
live_refresh_interval = 5

[export]
default_format = "csv"
include_metadata = true

[analytics]
default_timeframe = "daily"
recent_sessions_limit = 50
```

---

## Command Reference

### Session Analysis

#### `ocmonitor sessions`
Analyze all OpenCode sessions.

```bash
# All sessions
ocmonitor sessions

# Limit to N most recent
ocmonitor sessions --limit 10
ocmonitor sessions -l 5

# JSON output for scripting
ocmonitor sessions --format json

# Custom path
ocmonitor sessions ~/.local/share/opencode/storage/message
```

**Output includes:**
- Session ID and title
- Project name
- Interaction count
- Token usage (input/output/cache)
- Cost per session
- Duration

#### `ocmonitor session <path>`
Analyze a single session directory.

```bash
# Analyze specific session
ocmonitor session ~/.local/share/opencode/storage/message/ses_xxxxx

# JSON output
ocmonitor session /path/to/session --format json
```

---

### Time-Based Reports

#### `ocmonitor daily`
Daily usage breakdown.

```bash
# Current month daily breakdown
ocmonitor daily

# Specific month
ocmonitor daily --month 2025-01

# With per-model breakdown
ocmonitor daily --breakdown

# JSON export
ocmonitor daily --format json
```

#### `ocmonitor weekly`
Weekly usage aggregation.

```bash
# Default (Monday start)
ocmonitor weekly

# Custom week start
ocmonitor weekly --start-day sunday
ocmonitor weekly --start-day friday

# Specific year
ocmonitor weekly --year 2025

# With model breakdown
ocmonitor weekly --breakdown

# Combined
ocmonitor weekly --start-day sunday --breakdown --year 2025
```

**Week start options:** monday, tuesday, wednesday, thursday, friday, saturday, sunday

#### `ocmonitor monthly`
Monthly usage aggregation.

```bash
# All months
ocmonitor monthly

# Specific year
ocmonitor monthly --year 2025

# With breakdown
ocmonitor monthly --breakdown

# JSON format
ocmonitor monthly --format json
```

---

### Model Analytics

#### `ocmonitor models`
Model usage statistics and cost breakdown.

```bash
# All-time model usage
ocmonitor models

# By timeframe
ocmonitor models --timeframe daily
ocmonitor models --timeframe weekly
ocmonitor models --timeframe monthly

# Date range filter
ocmonitor models --start-date 2025-01-01 --end-date 2025-01-31

# JSON export
ocmonitor models --format json
```

**Metrics shown:**
- Model name
- Total tokens (input/output/cache)
- Session count
- Interaction count
- Total cost
- First/last used dates

---

### Project Analytics

#### `ocmonitor projects`
Project-level usage tracking.

```bash
# All projects
ocmonitor projects

# By timeframe
ocmonitor projects --timeframe weekly

# Date range
ocmonitor projects --start-date 2025-01-01 --end-date 2025-01-31

# JSON format
ocmonitor projects --format json
```

**Tracks:**
- Project name (from working directory)
- Total tokens across all sessions
- Session/interaction counts
- Cost attribution
- Models used per project
- Activity timeline

---

### Live Monitoring

#### `ocmonitor live`
Real-time dashboard for current session.

```bash
# Start live monitoring (5s refresh)
ocmonitor live

# Custom refresh interval
ocmonitor live --interval 10
ocmonitor live -i 3

# Disable colors
ocmonitor live --no-color

# Custom path
ocmonitor live ~/.local/share/opencode/storage/message
```

**Dashboard panels:**
| Panel | Content |
|-------|---------|
| Header | Project name, session title, timestamp |
| Tokens | Recent interaction + session totals |
| Cost | Current cost vs quota (progress bar) |
| Context | Context window usage % |
| Rate | Token burn rate (tokens/minute) |
| Session Time | Duration vs 5h max (progress bar) |
| Models | Per-model breakdown |

**Color coding:**
- Green: < 50% usage (safe)
- Yellow: 75-90% usage (warning)
- Red: > 90% usage (critical)

**Exit:** Press `Ctrl+C`

---

### Data Export

#### `ocmonitor export`
Export analysis results to files.

```bash
# Export session data to CSV
ocmonitor export sessions --format csv --output sessions.csv

# Export to JSON
ocmonitor export sessions --format json --output sessions.json

# Export daily report
ocmonitor export daily --format csv --output daily_report.csv

# Export model usage
ocmonitor export models --format json

# Export projects
ocmonitor export projects --format csv --output project_costs.csv
```

**Report types:** session, sessions, daily, weekly, monthly, models, projects

**Includes metadata:** timestamps, totals, generation info (when `include_metadata = true`)

---

### Configuration

#### `ocmonitor config show`
Display current configuration.

```bash
ocmonitor config show
```

**Shows:**
- Paths (messages dir, export dir)
- UI settings (table style, colors, progress bars)
- Export settings (format, metadata)
- Configured models and their pricing

---

## Data Structures

### OpenCode Storage Layout

```
~/.local/share/opencode/storage/
├── message/
│   ├── ses_abc123def456/        # Session directory
│   │   ├── msg_001.json         # Interaction files
│   │   ├── msg_002.json
│   │   └── ...
│   ├── ses_xyz789ghi012/
│   └── ...
└── session/
    ├── global/                   # Global sessions
    │   └── ses_abc123def456.json # Session metadata
    └── project-name/             # Project-specific
        └── ses_xxx.json
```

### Interaction File Format

```json
{
  "modelID": "claude-sonnet-4.5-20251101",
  "tokens": {
    "input": 15234,
    "output": 3847,
    "cache": {
      "write": 0,
      "read": 12500
    }
  },
  "time": {
    "created": 1735689600000,
    "completed": 1735689615000
  },
  "path": {
    "cwd": "/Users/user/project",
    "root": "/Users/user/project"
  }
}
```

### Session Metadata

```json
{
  "id": "ses_abc123def456",
  "title": "Implementing feature X",
  "created": 1735689600000,
  "updated": 1735696800000
}
```

---

## Model Pricing Reference

### Free Tier Models (No Cost)

| Model | Context Window |
|-------|---------------|
| grok-code-fast-1 | 256K |
| big-pickle | 128K |
| minimax-m2.1 | 200K |
| glm-4.7 | 131K |
| gpt-5-nano | 128K |

### Claude Family

| Model | Input | Output | Cache Write | Cache Read | Quota |
|-------|-------|--------|-------------|------------|-------|
| claude-sonnet-4.5 | $3.00/M | $15.00/M | $3.75/M | $0.30/M | $6 |
| claude-sonnet-4.5-extended | $6.00/M | $22.50/M | $7.50/M | $0.60/M | $6 |
| claude-haiku-4.5 | $1.00/M | $5.00/M | $1.25/M | $0.10/M | $6 |
| claude-opus-4.5 | $5.00/M | $25.00/M | $6.25/M | $0.50/M | $10 |

### Gemini Family

| Model | Input | Output | Cache Read | Context |
|-------|-------|--------|------------|---------|
| gemini-3-pro | $2.00/M | $12.00/M | $0.20/M | 200K |
| gemini-3-pro-extended | $4.00/M | $18.00/M | $0.40/M | 400K |
| gemini-3-flash | $0.50/M | $3.00/M | $0.05/M | 200K |

### GPT Family

| Model | Input | Output | Cache Read | Context |
|-------|-------|--------|------------|---------|
| gpt-5.1-codex | $1.07/M | $8.50/M | $0.107/M | 200K |
| gpt-5.1-codex-max | $1.25/M | $10.00/M | $0.125/M | 400K |
| gpt-5.1-codex-mini | $0.25/M | $2.00/M | $0.025/M | 128K |
| gpt-5.2 | $1.75/M | $14.00/M | $0.175/M | 200K |

### Other Models

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| kimi-k2 | $0.40/M | $2.50/M | 256K |
| kimi-k2-thinking | $0.40/M | $2.50/M | 256K |
| qwen3-coder-480b | $0.45/M | $1.50/M | 256K |
| glm-4.6 | $0.60/M | $2.20/M | 131K |

---

## Workflow Recipes

### Daily Monitoring Routine

```bash
# Morning check
ocmonitor sessions -l 5            # Recent activity
ocmonitor daily                    # Today's usage

# During work
ocmonitor live                     # Keep running in terminal

# End of day
ocmonitor export daily -f csv -o ~/logs/$(date +%Y-%m-%d).csv
```

### Weekly Review

```bash
# Weekly summary
ocmonitor weekly --breakdown

# Cost by project
ocmonitor projects --timeframe weekly

# Model efficiency
ocmonitor models --timeframe weekly

# Export for records
ocmonitor export weekly -f csv -o ~/reports/week-$(date +%V).csv
```

### Monthly Reporting

```bash
# Monthly overview
ocmonitor monthly --breakdown

# Full export
ocmonitor export monthly -f json -o ~/reports/$(date +%Y-%m).json
ocmonitor export models -f csv -o ~/reports/models-$(date +%Y-%m).csv
ocmonitor export projects -f csv -o ~/reports/projects-$(date +%Y-%m).csv
```

### Project Cost Tracking

```bash
# Current project costs
ocmonitor projects

# Export for budgeting
ocmonitor export projects -f csv -o project_costs.csv
```

### Model Comparison

```bash
# All-time model usage
ocmonitor models

# This month only
ocmonitor models --start-date $(date +%Y-%m-01)

# Export for analysis
ocmonitor models -f json | jq '.model_stats | sort_by(.total_cost) | reverse'
```

---

## Troubleshooting

### No Sessions Found

```bash
# Verify OpenCode storage exists
ls -la ~/.local/share/opencode/storage/message/

# Check for ses_* directories
ls -la ~/.local/share/opencode/storage/message/ | grep ses_

# Verify configuration
ocmonitor config show
```

### Unknown Model (Cost = $0)

Model not in `models.json`. Add pricing:

```json
{
  "model-name": {
    "input": 1.00,
    "output": 5.00,
    "cacheWrite": 0.00,
    "cacheRead": 0.10,
    "contextWindow": 128000,
    "sessionQuota": 0.00
  }
}
```

### Live Dashboard Not Updating

```bash
# Check if new sessions exist
ocmonitor sessions -l 1

# Try shorter interval
ocmonitor live -i 2

# Check terminal supports rich
python -c "from rich.console import Console; Console().print('[green]Test[/green]')"
```

### Export Failures

```bash
# Ensure export directory exists
mkdir -p ./exports

# Check permissions
ls -la ./exports/

# Try explicit output path
ocmonitor export sessions -f csv -o /tmp/test.csv
```

---

## Integration Tips

### Shell Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias ocm='ocmonitor'
alias ocml='ocmonitor live'
alias ocms='ocmonitor sessions -l 5'
alias ocmd='ocmonitor daily --breakdown'
alias ocmw='ocmonitor weekly --breakdown'
alias ocmp='ocmonitor projects'
```

### Tmux Integration

```bash
# Split pane with live monitor
tmux split-window -h 'ocmonitor live'
```

### Background Monitoring

```bash
# Log to file
ocmonitor live 2>&1 | tee ~/logs/ocmonitor.log &

# With timestamps
while true; do
  echo "=== $(date) ===" >> ~/logs/session.log
  ocmonitor sessions -l 1 -f json >> ~/logs/session.log
  sleep 300
done &
```

### JSON Processing with jq

```bash
# Top 5 costly models
ocmonitor models -f json | jq '.model_stats | sort_by(.total_cost) | reverse | .[0:5]'

# Total cost
ocmonitor sessions -f json | jq '.total_cost'

# Today's token usage
ocmonitor daily -f json | jq '.[-1].total_tokens'
```

---

## Key Metrics Glossary

| Metric | Description |
|--------|-------------|
| **Input Tokens** | Tokens sent to the model (prompts, context) |
| **Output Tokens** | Tokens generated by the model (responses) |
| **Cache Write** | Tokens written to prompt cache (initial context) |
| **Cache Read** | Tokens read from cache (reused context) |
| **Context Window** | Maximum tokens model can process |
| **Session Quota** | Max cost allowed per session |
| **Burn Rate** | Tokens consumed per minute |
| **Session Duration** | Time from first to last interaction |

---

## Files & Locations

| Item | Path |
|------|------|
| OpenCode Messages | `~/.local/share/opencode/storage/message/` |
| Session Metadata | `~/.local/share/opencode/storage/session/` |
| OCMonitor Config | `~/.config/ocmonitor/config.toml` |
| Model Pricing | `~/projetos/hub/ocmonitor-share/models.json` |
| Default Exports | `./exports/` |
| Agent Skill | `~/.config/opencode/skills/ocmonitor.md` |

---

## Version Info

- **Package:** ocmonitor 1.0.0
- **Python:** 3.8+
- **Dependencies:** click, rich, pydantic, toml
- **Source:** `~/projetos/hub/ocmonitor-share/`
