import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MCP_CONFIG_DIR = path.join(CONFIG_DIR, 'mcp-config');
const BASE_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.base.json');
const PROFILES_PATH = path.join(CONFIG_DIR, 'profiles.json');
const OUTPUT_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.json');

// Helper to load JSON
function loadJson(filePath: string): any {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error parsing JSON from ${filePath}:`, e);
    process.exit(1);
  }
}

// Main function
function switchProfile(profileName: string) {
  console.log(`\n🔄 Switching OpenCode to profile: '${profileName}'...`);

  // 1. Load Configs
  const baseConfig = loadJson(BASE_CONFIG_PATH);
  const profiles = loadJson(PROFILES_PATH);

  // 2. Validate Profile
  if (!profiles[profileName]) {
    console.error(`❌ Profile '${profileName}' not found in profiles.json`);
    console.log('Available profiles:', Object.keys(profiles).join(', '));
    process.exit(1);
  }

  const profile = profiles[profileName];
  console.log(`📝 Description: ${profile.description}`);

  // 3. Apply Profile Overrides
  // Global Model
  if (profile.model) {
    console.log(`   - Global Model: ${profile.model}`);
    baseConfig.model = profile.model;
  }

  // Agent Models
  if (profile.agents) {
    for (const [agentName, agentModel] of Object.entries(profile.agents)) {
      if (baseConfig.agent && baseConfig.agent[agentName]) {
        console.log(`   - Agent '${agentName}': ${agentModel}`);
        baseConfig.agent[agentName].model = agentModel;
      } else {
        console.warn(`   ⚠️  Warning: Agent '${agentName}' in profile but not in base config.`);
      }
    }
  }

  // 4. Merge MCP Configs (Logic from manage-mcp.ts)
  console.log('\n🔌 Merging MCP configurations...');
  if (!baseConfig.mcp) {
    baseConfig.mcp = {};
  }

  if (fs.existsSync(MCP_CONFIG_DIR)) {
    const files = fs.readdirSync(MCP_CONFIG_DIR).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(MCP_CONFIG_DIR, file);
      const mcpConfig = loadJson(filePath);
      const servers = mcpConfig.mcp || mcpConfig;
      
      for (const [serverName, serverConfig] of Object.entries(servers)) {
        baseConfig.mcp[serverName] = serverConfig;
      }
    }
  }

  // 5. Write Output
  fs.writeFileSync(OUTPUT_CONFIG_PATH, JSON.stringify(baseConfig, null, 2));
  console.log(`\n✅ Successfully generated opencode.json with '${profileName}' profile.`);
}

// CLI Handling
const args = process.argv.slice(2);
const profileArg = args.find(arg => arg.startsWith('--profile='));
const profileName = profileArg ? profileArg.split('=')[1] : 'copilot'; // Default to copilot

switchProfile(profileName);
