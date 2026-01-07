import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MACHINES_PATH = path.join(CONFIG_DIR, 'machines.json');
const MCP_CONFIG_DIR = path.join(CONFIG_DIR, 'mcp-config');
const BASE_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.base.json');
const PROFILES_PATH = path.join(CONFIG_DIR, 'profiles.json');
const OUTPUT_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.json');

interface MachineProfile {
  platform: string;
  hostname?: string;
  description?: string;
  paths: Record<string, string>;
  mcps: Record<string, boolean>;
}

interface MachinesConfig {
  [key: string]: MachineProfile | string | undefined;
  _active?: string;
}

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

// Apply machine placeholders recursively to any object
function applyMachinePlaceholders(obj: any, machinePaths: Record<string, string>): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string' && obj.includes('{machine:')) {
    const replaced = obj.replace(/\{machine:([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim();
      if (machinePaths[trimmedKey] === undefined) {
        console.error(`   ❌ No machine path for: {machine:${trimmedKey}}`);
        process.exit(1);
      }
      return machinePaths[trimmedKey];
    });
    return replaced;
  }

  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = applyMachinePlaceholders(obj[key], machinePaths);
    }
    return newObj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => applyMachinePlaceholders(item, machinePaths));
  }

  return obj;
}

// Apply profile placeholders recursively to any object
function applyProfilePlaceholders(obj: any, profile: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string' && obj.includes('{profile:')) {
    const replaced = obj.replace(/\{profile:([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim();
      const keys = trimmedKey.split('.');
      let value = profile;
      for (const k of keys) {
        if (value) {
          value = value[k];
        } else {
          return match;
        }
      }
      return value !== undefined ? String(value) : '';
    });
    return replaced;
  }

  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = applyProfilePlaceholders(obj[key], profile);
    }
    return newObj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => applyProfilePlaceholders(item, profile));
  }

  return obj;
}

function getActiveMachine(): string {
  const machines: MachinesConfig = loadJson(MACHINES_PATH);
  let machineName = machines._active;

  if (!machineName) {
    console.log('\n⚠️  No active machine set. Detecting...');
    const currentPlatform = process.platform;
    const currentHostname = os.hostname();

    for (const [name, profile] of Object.entries(machines)) {
      if (name.startsWith('_') || name.startsWith('$')) continue;
      if (typeof profile === 'string') continue;

      const machineProfile = profile as MachineProfile;

      if (machineProfile.platform === currentPlatform) {
        if (machineProfile.hostname) {
          if (currentHostname.toLowerCase().includes(machineProfile.hostname.toLowerCase())) {
            machineName = name;
            break;
          }
        } else {
          machineName = name;
          break;
        }
      }
    }

    if (!machineName) {
      console.error('\n❌ No matching machine profile found.');
      console.error('   Add a profile to machines.json for this machine.');
      process.exit(1);
    }
  }

  return machineName;
}

function getMachineProfile(machineName: string): MachineProfile {
  const machines: MachinesConfig = loadJson(MACHINES_PATH);
  const profile = machines[machineName];

  if (!profile || typeof profile === 'string') {
    console.error(`\n❌ Machine profile '${machineName}' not found.`);
    const available = Object.keys(machines).filter(key => !key.startsWith('_') && typeof machines[key] !== 'string');
    console.error(`Available machines: ${available.join(', ')}`);
    process.exit(1);
  }

  return profile as MachineProfile;
}

function switchProfile(profileName: string) {
  console.log(`\n🔄 Switching OpenCode to profile: '${profileName}'...`);

  const profiles = loadJson(PROFILES_PATH);

  if (!profiles[profileName]) {
    console.error(`❌ Profile '${profileName}' not found in profiles.json`);
    console.log('Available profiles:', Object.keys(profiles).join(', '));
    process.exit(1);
  }

  const profile = profiles[profileName];
  console.log(`📝 Description: ${profile.description}`);

  const machineName = getActiveMachine();
  const machineProfile = getMachineProfile(machineName);
  console.log(`🖥️  Machine: ${machineName} (${machineProfile.description || 'No description'})`);

  console.log('\n📝 Loading template config...');
  let config = loadJson(BASE_CONFIG_PATH);

  console.log('\n📝 Step 1: Applying machine placeholders...');
  console.log(`   Machine paths: ${JSON.stringify(machineProfile.paths)}`);
  config = applyMachinePlaceholders(config, machineProfile.paths);
  console.log('   ✓ Machine placeholders resolved');

  console.log('\n📝 Step 2: Applying profile placeholders...');
  config = applyProfilePlaceholders(config, profile);
  console.log('   ✓ Profile placeholders resolved');

  console.log('\n🔌 Merging MCP configurations...');
  if (!config.mcp) {
    config.mcp = {};
  }

  if (fs.existsSync(MCP_CONFIG_DIR)) {
    const files = fs.readdirSync(MCP_CONFIG_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(MCP_CONFIG_DIR, file);
      const mcpConfig = loadJson(filePath);
      const servers = mcpConfig.mcp || mcpConfig;

      for (const [serverName, serverConfig] of Object.entries(servers)) {
        config.mcp[serverName] = serverConfig;
      }
    }
  }

  console.log('\n📝 Writing opencode.json...');
  fs.writeFileSync(OUTPUT_CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(`\n✅ Successfully generated opencode.json with '${profileName}' profile on '${machineName}' machine.`);
}

const args = process.argv.slice(2);
const profileArg = args.find(arg => arg.startsWith('--profile='));
const name = profileArg ? profileArg.split('=')[1] : 'copilot';

switchProfile(name);
