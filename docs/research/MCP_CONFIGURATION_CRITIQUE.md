# Critical Analysis: OpenCode Configuration & MCP Management

## Executive Summary
You are currently running a **custom-built, bespoke configuration architecture**. The `scripts/manage-mcp.ts` system is **not** a standard OpenCode feature, nor is it a widely adopted community pattern. It was engineered specifically for this environment to solve the problem of a monolithic `opencode.json` file.

While it solves the "modularity" problem, it introduces significant "cognitive overhead" and "dependency weight."

## 1. The Current Architecture: "The Build Step"

### What is it?
We have effectively turned configuration into a **compilation process**.
- **Source Code**: `opencode.base.json` + `mcp-config/*.json`
- **Compiler**: `scripts/manage-mcp.ts` (running via `ts-node`)
- **Binary/Artifact**: `opencode.json`

### The Critique
1.  **Dependency Heaviness**:
    - We are using `ts-node` (a TypeScript execution engine) just to merge JSON files. This is like using a sledgehammer to crack a nut. It requires `node_modules`, `typescript`, and `ts-node` to be present and healthy.
    - If `npm` breaks or `node_modules` gets deleted, **you cannot change your editor configuration**. This is a high-risk coupling.

2.  **State Ambiguity (The "Where do I edit?" Problem)**:
    - You mentioned feeling "ambiguous" about the state. This is valid.
    - If you edit `opencode.json` (the natural place), your changes are lost on the next build.
    - If you edit `mcp-config/core.json`, nothing happens until you run the build command.
    - **Result**: A "Split-Brain" configuration state where the file OpenCode reads is not the file you edit.

3.  **The "Big Ass Command"**:
    - `npx ts-node scripts/manage-mcp.ts enable perplexity`
    - This is verbose, hard to memorize, and slow (TS compilation time). It discourages quick experimentation (toggling things on/off).

## 2. The "Perplexity" Case Study (Toggling Friction)

**The Scenario**: You have a broken Perplexity config. You want it "there but off."

**Current Workflow**:
1.  Find `mcp-config/experimental.json`.
2.  Find the `perplexity` block.
3.  Set `"enabled": false`.
4.  Run the build script.
5.  Restart OpenCode (usually).

**The Friction**:
- The configuration is "ready" (API keys, settings), but the mechanism to activate it is buried in a file edit + build step.
- Ideally, "dormant" configs should be zero-cost to keep, but zero-friction to wake up.

## 3. Recommendations & Optimization Strategy

We should move from "Engineering Complexity" to "Operational Simplicity."

### Option A: The "Agent Abstraction" (Keep Complexity, Hide it)
Since we just built `opencode-config-manager`, we can decide that **you (the human) never run the script**.
- **Philosophy**: The script is an internal implementation detail of the agent.
- **Workflow**: You tell the agent: "Disable Perplexity." The agent handles the file editing and rebuilding.
- **Pros**: Zero cognitive load for you.
- **Cons**: You become dependent on the agent to manage the system.

### Option B: The "Native" Simplification (Remove the Script)
OpenCode supports project-level overrides (`.opencode/opencode.json`).
- **Strategy**: Keep the global `~/.config/opencode/opencode.json` minimal and stable.
- **Toggling**: Use local project configs to enable specific tools for specific projects.
- **Pros**: Uses native OpenCode behavior. No build steps. No `ts-node`.
- **Cons**: Less centralized control over "profiles" (e.g., "Research Mode" across all projects).

### Option C: The "Lightweight" Script (Optimize the Tool)
If we must keep the merge logic (to organize 50+ tools), we should strip the weight.
1.  **Rewrite in plain JS**: Remove `ts-node` and TypeScript. Run with standard `node`.
2.  **Create Shell Aliases**:
    - `opencode-mcp-on perplexity`
    - `opencode-mcp-off perplexity`
3.  **Pros**: Faster, no compilation, easier to read.

## 4. The "Dormant Config" Pattern

Regarding your specific point about Perplexity:

**Recommendation**:
Keep the configuration in `mcp-config/experimental.json` but set `enabled: false` by default.

**The "Ready-to-Go" Pattern**:
Instead of deleting broken configs, we should standardize a "Dormant" state:
```json
"perplexity": {
  "type": "local",
  "enabled": false, // <--- The Master Switch
  "command": [...],
  "environment": { "API_KEY": "PLACEHOLDER" } // Explicitly marked as needing setup
}
```

## 5. Verdict

The current system is **Over-Engineered** for a single user setup, but **Necessary** if you plan to maintain 50+ tools and switch contexts frequently.

**Immediate Action Item**:
Do not worry about `ts-node`. It is just a runner. Focus on the **Agent Interface**.
- Stop running the command yourself.
- Use the `opencode-config-manager` to toggle things.
- Let the agent deal with the "niceness" (or lack thereof) of the underlying script.
