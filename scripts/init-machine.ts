import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MACHINES_PATH = path.join(CONFIG_DIR, 'machines.json');
const MCP_CONFIG_DIR = path.join(CONFIG_DIR, 'mcp-config');
const TEMPLATE_PATH = path.join(CONFIG_DIR, 'opencode.template.json');
const OPENCODE_PATH = path.join(CONFIG_DIR, 'opencode.json');

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

type PlaceholderResolution = {
  content: string;
  replacedKeys: string[];
  missingKeys: string[];
};

function loadJson(filePath: string): any {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Failed to parse JSON at ${filePath}`);
    console.error(error);
    process.exit(1);
  }
}

function saveJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function listAvailableMachines(machines: MachinesConfig): string[] {
  return Object.keys(machines).filter(key => !key.startsWith('_') && !key.startsWith('$') && typeof machines[key] !== 'string');
}

function resolveMachinePlaceholders(content: string, paths: Record<string, string>): PlaceholderResolution {
  const replacedKeys = new Set<string>();
  const missingKeys = new Set<string>();

  const resolved = content.replace(/\{machine:([^}]+)\}/g, (match, key) => {
    const trimmedKey = key.trim();
    if (paths[trimmedKey] === undefined) {
      missingKeys.add(trimmedKey);
      return match;
    }
    replacedKeys.add(trimmedKey);
    return paths[trimmedKey];
  });

  return {
    content: resolved,
    replacedKeys: Array.from(replacedKeys),
    missingKeys: Array.from(missingKeys)
  };
}

function generateOpencodeFromTemplate(profile: MachineProfile) {
  console.log('\n📄 Generating opencode.json from template...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.log('   ⚠️  No opencode.template.json found. Skipping template generation.');
    return;
  }

  const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const { content, replacedKeys, missingKeys } = resolveMachinePlaceholders(templateContent, profile.paths);

  if (missingKeys.length > 0) {
    console.error(`   ❌ Template contains unresolved placeholders: ${missingKeys.map(k => `{machine:${k}}`).join(', ')}`);
    console.error('   Please define the missing paths in machines.json.');
    process.exit(1);
  }

  fs.writeFileSync(OPENCODE_PATH, content);
  
  if (replacedKeys.length > 0) {
    console.log(`   ✓ Generated opencode.json with resolved paths: ${replacedKeys.map(k => `{machine:${k}}`).join(', ')}`);
  } else {
    console.log('   ✓ Generated opencode.json (no machine placeholders found).');
  }
}

function processMcpConfigs(profile: MachineProfile) {
  console.log('\n🔌 Updating MCP configuration files...');

  if (!fs.existsSync(MCP_CONFIG_DIR)) {
    console.log('   ⚠️  No mcp-config directory found. Skipping placeholder replacement.');
    return;
  }

  const files = fs.readdirSync(MCP_CONFIG_DIR).filter(file => file.endsWith('.json')).sort();
  if (files.length === 0) {
    console.log('   ⚠️  No MCP config files found.');
    return;
  }

  const unresolvedKeys = new Set<string>();

  for (const file of files) {
    const filePath = path.join(MCP_CONFIG_DIR, file);
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const { content, replacedKeys, missingKeys } = resolveMachinePlaceholders(originalContent, profile.paths);

    if (missingKeys.length > 0) {
      missingKeys.forEach(key => unresolvedKeys.add(key));
      console.error(`   ❌ ${file}: missing path mappings for ${missingKeys.map(k => `{machine:${k}}`).join(', ')}`);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      if (replacedKeys.length > 0) {
        console.log(`   ✓ ${file}: replaced ${replacedKeys.map(k => `{machine:${k}}`).join(', ')}`);
      } else {
        console.log(`   ✓ ${file}: updated with machine-specific paths.`);
      }
    } else {
      console.log(`   - ${file}: no machine placeholders found.`);
    }
  }

  if (unresolvedKeys.size > 0) {
    console.error('\n❌ Unable to resolve all placeholders. Please define the missing paths in machines.json.');
    process.exit(1);
  }
}

function rebuildOpencodeConfig() {
  console.log('\n🛠️  Rebuilding opencode.json from modular configs...');
  const result = spawnSync('npx', ['ts-node', 'scripts/manage-mcp.ts', 'build'], {
    cwd: CONFIG_DIR,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    console.error('\n❌ Failed to rebuild opencode.json. See logs above for details.');
    process.exit(result.status ?? 1);
  }

  console.log('\n✅ opencode.json successfully rebuilt.');
}

function printUsage(machines?: MachinesConfig) {
  const available = machines ? listAvailableMachines(machines) : [];
  console.log('Usage: npm run init:machine -- --machine=<name>');
  if (machines) {
    console.log(`\nAvailable machines: ${available.length > 0 ? available.join(', ') : 'none'}`);
    console.log(`Current active: ${machines._active || 'none'}`);
  }
}

function switchMachine(machineName: string) {
  console.log(`\n🔄 Switching to machine profile: '${machineName}'...`);

  const machines: MachinesConfig = loadJson(MACHINES_PATH);
  const availableMachines = listAvailableMachines(machines);

  if (!machines[machineName] || typeof machines[machineName] === 'string') {
    console.error(`❌ Machine profile '${machineName}' not found.`);
    console.log(`Available machines: ${availableMachines.join(', ')}`);
    process.exit(1);
  }

  const profile = machines[machineName] as MachineProfile;
  console.log(`📝 Description: ${profile.description || 'No description provided'}`);
  console.log(`   Platform: ${profile.platform}`);

  machines._active = machineName;
  saveJson(MACHINES_PATH, machines);
  console.log(`✅ Updated active machine to '${machineName}'.`);

  generateOpencodeFromTemplate(profile);
  processMcpConfigs(profile);

  console.log('\n📁 Resolved path mappings:');
  for (const [key, value] of Object.entries(profile.paths)) {
    console.log(`   {machine:${key}} → ${value}`);
  }
}

function getActiveMachine(): string | null {
  const machines: MachinesConfig = loadJson(MACHINES_PATH);
  return machines._active || null;
}

function main() {
  const args = process.argv.slice(2);
  const machineArg = args.find(arg => arg.startsWith('--machine='));
  const quietMode = args.includes('--quiet') || args.includes('-q');

  let machineName: string | null = null;

  if (machineArg) {
    // Explicit machine specified
    machineName = machineArg.split('=')[1];
    if (!machineName) {
      console.error('❌ Missing machine name after --machine=');
      printUsage();
      process.exit(1);
    }
  } else {
    // No argument - use active machine from machines.json
    machineName = getActiveMachine();
    
    if (!machineName) {
      console.error('❌ No active machine profile set.');
      console.error('');
      console.error('To fix this, either:');
      console.error('  1. Run: npm run detect:machine:set   (auto-detect based on platform/hostname)');
      console.error('  2. Run: npm run init:machine -- --machine=<name>');
      console.error('');
      const machines: MachinesConfig = loadJson(MACHINES_PATH);
      const available = listAvailableMachines(machines);
      console.error(`Available machines: ${available.length > 0 ? available.join(', ') : 'none'}`);
      process.exit(1);
    }
    
    if (!quietMode) {
      console.log(`ℹ️  Using active machine profile: '${machineName}'`);
    }
  }

  switchMachine(machineName);
}

main();
