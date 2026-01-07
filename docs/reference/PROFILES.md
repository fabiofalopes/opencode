# OpenCode Profile Management

This system allows you to instantly switch between different model providers and configurations without manually editing JSON files.

## 🚀 Quick Switch Commands

Run these commands from `~/.config/opencode/`:

| Command | Profile | Description |
|---------|---------|-------------|
| `npm run switch:gemini` | **Gemini 3** | **Primary.** Uses Google's Gemini 3 Pro/Flash models. Best for multimodal & thinking. |
| `npm run switch:grok` | **Grok** | **Secondary.** OpenCode's free tier. Fast but has limits. |
| `npm run switch:free` | **OpenRouter** | **Fallback.** Uses completely free endpoints (Gemini 2.0 Flash Exp). |
| `npm run switch:copilot` | **Copilot** | **Legacy.** Uses GitHub Copilot subscription models. |

## ⚙️ Configuration

### Profiles Definition
Profiles are defined in `profiles.json`. You can edit this file to:
- Change the default model for a profile.
- Assign specific models to specific agents (e.g., use a stronger model for `research`).

### How it Works
The `scripts/switch-profile.ts` script:
1. Reads `opencode.base.json` (your template).
2. Reads `profiles.json`.
3. Merges the selected profile's models into the config.
4. Merges all MCP configurations.
5. Generates the final `opencode.json`.

## 🛠️ Adding New Profiles

1. Open `profiles.json`.
2. Add a new key (e.g., `"local"`).
3. Define the `model` and `agents` map.
4. Add a shortcut to `package.json` (optional).

```json
"local": {
  "description": "Local Ollama Models",
  "model": "ollama/llama3",
  "agents": { ... }
}
```
