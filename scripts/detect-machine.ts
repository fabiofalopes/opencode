import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MACHINES_PATH = path.join(CONFIG_DIR, 'machines.json');

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

function loadMachines(): MachinesConfig {
  if (!fs.existsSync(MACHINES_PATH)) {
    console.error('❌ machines.json not found');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(MACHINES_PATH, 'utf-8'));
}

function detectMachine(): string | null {
  const machines = loadMachines();
  const currentPlatform = process.platform;
  const currentHostname = os.hostname();

  console.log(`🔍 Detecting machine...`);
  console.log(`   Platform: ${currentPlatform}`);
  console.log(`   Hostname: ${currentHostname}`);

  // Find matching profile
  for (const [name, profile] of Object.entries(machines)) {
    if (name.startsWith('_') || name.startsWith('$')) continue;
    if (typeof profile === 'string') continue;
    
    const machineProfile = profile as MachineProfile;
    
    // Match by platform first
    if (machineProfile.platform === currentPlatform) {
      // If hostname specified, check it too
      if (machineProfile.hostname) {
        if (currentHostname.toLowerCase().includes(machineProfile.hostname.toLowerCase())) {
          return name;
        }
      } else {
        // Platform match without hostname requirement
        return name;
      }
    }
  }

  return null;
}

function setActiveMachine(machineName: string) {
  const machines = loadMachines();
  machines._active = machineName;
  fs.writeFileSync(MACHINES_PATH, JSON.stringify(machines, null, 2));
  console.log(`✅ Set active machine to: ${machineName}`);
}

// CLI
const args = process.argv.slice(2);
const setFlag = args.includes('--set');

const detected = detectMachine();

if (detected) {
  console.log(`\n✅ Detected machine profile: ${detected}`);
  
  if (setFlag) {
    setActiveMachine(detected);
  } else {
    console.log(`   Run with --set to update machines.json`);
  }
} else {
  console.log(`\n⚠️  No matching machine profile found.`);
  console.log(`   Add a profile to machines.json for this machine.`);
  process.exit(1);
}
