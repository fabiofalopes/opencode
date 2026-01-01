import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MCP_CONFIG_DIR = path.join(CONFIG_DIR, 'mcp-config');
const BASE_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.base.json');
const OUTPUT_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.json');

// Interface for the config structure
interface OpencodeConfig {
  mcp?: Record<string, any>;
  [key: string]: any;
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

function mergeConfigs() {
  console.log('Building opencode.json from modular configs...');

  // 1. Load Base Config
  const baseConfig: OpencodeConfig = loadJson(BASE_CONFIG_PATH);
  
  // Initialize mcp object if it doesn't exist
  if (!baseConfig.mcp) {
    baseConfig.mcp = {};
  }

  // 2. Load and Merge MCP Configs
  if (fs.existsSync(MCP_CONFIG_DIR)) {
    const files = fs.readdirSync(MCP_CONFIG_DIR).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(MCP_CONFIG_DIR, file);
      const mcpConfig = loadJson(filePath);
      
      console.log(`Merging ${file}...`);
      
      // Merge keys from the file into the main mcp object
      // We assume the file structure is either { "serverName": { ... } } directly 
      // or { "mcp": { "serverName": { ... } } }
      // Let's standardize on the file containing just the server definitions object
      
      const servers = mcpConfig.mcp || mcpConfig; // Handle both wrapped and unwrapped
      
      for (const [serverName, serverConfig] of Object.entries(servers)) {
        baseConfig.mcp![serverName] = serverConfig;
      }
    }
  }

  // 3. Write Output
  fs.writeFileSync(OUTPUT_CONFIG_PATH, JSON.stringify(baseConfig, null, 2));
  console.log(`Successfully wrote to ${OUTPUT_CONFIG_PATH}`);
}

// CLI Argument Handling
const args = process.argv.slice(2);
const command = args[0];

if (command === 'build') {
  mergeConfigs();
} else if (command === 'enable' || command === 'disable') {
  const serverName = args[1];
  if (!serverName) {
    console.error(`Usage: ts-node manage-mcp.ts ${command} <server_name>`);
    process.exit(1);
  }
  
  // Find which file contains the server
  if (fs.existsSync(MCP_CONFIG_DIR)) {
    const files = fs.readdirSync(MCP_CONFIG_DIR).filter(f => f.endsWith('.json'));
    let found = false;

    for (const file of files) {
      const filePath = path.join(MCP_CONFIG_DIR, file);
      const config = loadJson(filePath);
      const servers = config.mcp || config;

      if (servers[serverName]) {
        servers[serverName].enabled = (command === 'enable');
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        console.log(`${command}d ${serverName} in ${file}`);
        found = true;
        break;
      }
    }

    if (found) {
      mergeConfigs();
    } else {
      console.error(`Server '${serverName}' not found in any config file.`);
    }
  }
} else {
  console.log('Usage:');
  console.log('  ts-node manage-mcp.ts build');
  console.log('  ts-node manage-mcp.ts enable <server_name>');
  console.log('  ts-node manage-mcp.ts disable <server_name>');
}
