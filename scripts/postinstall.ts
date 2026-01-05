#!/usr/bin/env ts-node
/**
 * Post-install hook for OpenCode config
 * 
 * Runs after `npm install` to ensure opencode.json is properly configured
 * for the current machine.
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MACHINES_PATH = path.join(CONFIG_DIR, 'machines.json');
const OPENCODE_PATH = path.join(CONFIG_DIR, 'opencode.json');
const TEMPLATE_PATH = path.join(CONFIG_DIR, 'opencode.template.json');

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

function loadMachines(): MachinesConfig | null {
  if (!fs.existsSync(MACHINES_PATH)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(MACHINES_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function listAvailableMachines(machines: MachinesConfig): string[] {
  return Object.keys(machines).filter(
    key => !key.startsWith('_') && !key.startsWith('$') && typeof machines[key] !== 'string'
  );
}

function main() {
  console.log('\n🔧 OpenCode Post-Install Check\n');

  // Check if machines.json exists
  const machines = loadMachines();
  if (!machines) {
    console.log('⚠️  No machines.json found. Multi-machine config not set up.');
    console.log('   See docs/MULTI_MACHINE_SETUP.md for setup instructions.');
    return;
  }

  const activeMachine = machines._active;
  const hasOpencode = fs.existsSync(OPENCODE_PATH);
  const hasTemplate = fs.existsSync(TEMPLATE_PATH);

  // If opencode.json exists, check if it might be stale
  if (hasOpencode) {
    if (activeMachine) {
      console.log(`✅ opencode.json exists`);
      console.log(`   Active machine: ${activeMachine}`);
      console.log('');
      console.log('   To regenerate config: npm run refresh');
    } else {
      console.log('⚠️  opencode.json exists but no active machine set.');
      console.log('   Run: npm run detect:machine:set');
    }
    return;
  }

  // No opencode.json - need to generate it
  console.log('⚠️  No opencode.json found - needs generation');
  console.log('');

  if (!hasTemplate) {
    console.log('❌ No opencode.template.json found either.');
    console.log('   Cannot auto-generate configuration.');
    return;
  }

  if (activeMachine) {
    console.log(`   Active machine profile: ${activeMachine}`);
    console.log('');
    console.log('   Generating opencode.json automatically...');
    console.log('');

    // Run init:machine with the active profile
    const result = spawnSync('npx', ['ts-node', 'scripts/init-machine.ts', '--quiet'], {
      cwd: CONFIG_DIR,
      stdio: 'inherit'
    });

    if (result.status === 0) {
      console.log('\n✅ opencode.json generated successfully!');
    } else {
      console.error('\n❌ Failed to generate opencode.json');
      console.error('   Run manually: npm run refresh');
    }
  } else {
    // No active machine - prompt user
    const available = listAvailableMachines(machines);
    console.log('   No active machine profile set.');
    console.log('');
    console.log('   To set up, run one of:');
    console.log('     npm run detect:machine:set   # Auto-detect machine');
    if (available.length > 0) {
      console.log(`     npm run init:machine -- --machine=<name>`);
      console.log(`     Available: ${available.join(', ')}`);
    }
  }
}

main();
