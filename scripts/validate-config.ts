import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const MCP_CONFIG_DIR = path.join(CONFIG_DIR, 'mcp-config');
const BASE_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.base.json');

// Valid keys for MCP server configuration
const VALID_MCP_KEYS = [
  'type',
  'command',
  'environment',
  'enabled',
  'timeout',
  'url',
  'headers',
  'oauth'
];

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

function validateMcpConfig(serverName: string, config: any, sourceFile: string) {
  const errors: string[] = [];
  
  // Check for unknown keys
  Object.keys(config).forEach(key => {
    if (!VALID_MCP_KEYS.includes(key)) {
      errors.push(`Unknown key '${key}' in server '${serverName}' (from ${sourceFile})`);
    }
  });

  // Check required keys based on type
  if (!config.type) {
    errors.push(`Missing 'type' in server '${serverName}'`);
  } else if (config.type === 'local') {
    if (!config.command) {
      errors.push(`Missing 'command' for local server '${serverName}'`);
    }
  } else if (config.type === 'remote') {
    if (!config.url) {
      errors.push(`Missing 'url' for remote server '${serverName}'`);
    }
  } else {
    errors.push(`Invalid type '${config.type}' for server '${serverName}'`);
  }

  return errors;
}

function validate() {
  console.log('Validating OpenCode configuration...');
  let hasErrors = false;

  // 1. Validate Base Config
  console.log(`Checking ${BASE_CONFIG_PATH}...`);
  const baseConfig = loadJson(BASE_CONFIG_PATH);
  
  if (!baseConfig.model) {
    console.error('Error: Missing "model" in opencode.base.json');
    hasErrors = true;
  }

  // 2. Validate MCP Configs
  if (fs.existsSync(MCP_CONFIG_DIR)) {
    const files = fs.readdirSync(MCP_CONFIG_DIR).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = path.join(MCP_CONFIG_DIR, file);
      console.log(`Checking ${file}...`);
      const mcpConfig = loadJson(filePath);
      
      const servers = mcpConfig.mcp || mcpConfig;
      
      for (const [serverName, serverConfig] of Object.entries(servers)) {
        const errors = validateMcpConfig(serverName as string, serverConfig, file);
        if (errors.length > 0) {
          hasErrors = true;
          errors.forEach(e => console.error(`Error: ${e}`));
        }
      }
    }
  }

  if (hasErrors) {
    console.error('\nValidation FAILED. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\nValidation SUCCESS. Configuration looks good.');
  }
}

validate();
