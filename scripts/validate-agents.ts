import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const AGENT_DIR = path.join(CONFIG_DIR, '.opencode/agent');

// Valid modes for agent configuration
const VALID_MODES = ['primary', 'subagent', 'all'];

interface ValidationResult {
  file: string;
  passed: boolean;
  errors: string[];
}

/**
 * Parse YAML frontmatter from markdown content.
 * Native parsing without external dependencies.
 */
function parseFrontmatter(content: string): Record<string, any> | null {
  const lines = content.split('\n');
  
  // Check for opening ---
  if (lines[0].trim() !== '---') {
    return null;
  }

  // Find closing ---
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return null;
  }

  // Parse key-value pairs from frontmatter
  const frontmatterLines = lines.slice(1, endIndex);
  const result: Record<string, any> = {};
  let currentKey: string | null = null;
  let currentIndent = 0;
  let nestedObject: Record<string, any> = {};

  for (const line of frontmatterLines) {
    // Skip empty lines
    if (line.trim() === '') continue;

    // Calculate indentation
    const indent = line.length - line.trimStart().length;
    const trimmedLine = line.trim();

    // Check if this is a key-value pair
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmedLine.slice(0, colonIndex).trim();
    const value = trimmedLine.slice(colonIndex + 1).trim();

    if (indent === 0) {
      // Top-level key
      if (value === '') {
        // This starts a nested object
        currentKey = key;
        currentIndent = indent;
        nestedObject = {};
        result[key] = nestedObject;
      } else {
        // Simple key-value
        currentKey = null;
        result[key] = parseValue(value);
      }
    } else if (currentKey && indent > currentIndent) {
      // Nested key-value
      nestedObject[key] = parseValue(value);
    }
  }

  return result;
}

/**
 * Parse a YAML value (handles booleans, numbers, strings)
 */
function parseValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  
  // Check if it's a number
  const num = Number(value);
  if (!isNaN(num) && value !== '') return num;
  
  // Check if it's a quoted string
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Check if it starts with [ (array)
  if (value.startsWith('[')) {
    return 'ARRAY_DETECTED';
  }
  
  return value;
}

/**
 * Validate a single agent file
 */
function validateAgentFile(filePath: string): ValidationResult {
  const fileName = path.basename(filePath);
  const errors: string[] = [];

  // Read file
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return {
      file: fileName,
      passed: false,
      errors: [`Cannot read file: ${e}`]
    };
  }

  // Parse frontmatter
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    return {
      file: fileName,
      passed: false,
      errors: ['No valid YAML frontmatter found (missing --- markers)']
    };
  }

  // Validate: description is required
  if (!frontmatter.description) {
    errors.push('Missing required field: description');
  } else if (typeof frontmatter.description !== 'string') {
    errors.push('Field "description" must be a string');
  }

  // Validate: tools must NOT be an array (critical check)
  if (frontmatter.tools !== undefined) {
    if (frontmatter.tools === 'ARRAY_DETECTED') {
      errors.push('Field "tools" must be Record<string, boolean>, not an array');
    } else if (Array.isArray(frontmatter.tools)) {
      errors.push('Field "tools" must be Record<string, boolean>, not an array');
    } else if (typeof frontmatter.tools !== 'object') {
      errors.push('Field "tools" must be Record<string, boolean>');
    } else {
      // Check that all values in tools are booleans
      for (const [toolName, toolValue] of Object.entries(frontmatter.tools)) {
        if (typeof toolValue !== 'boolean') {
          errors.push(`Tool "${toolName}" value must be boolean, got ${typeof toolValue}`);
        }
      }
    }
  }

  // Validate: temperature must be 0-1 if present
  if (frontmatter.temperature !== undefined) {
    if (typeof frontmatter.temperature !== 'number') {
      errors.push('Field "temperature" must be a number');
    } else if (frontmatter.temperature < 0 || frontmatter.temperature > 1) {
      errors.push(`Field "temperature" must be between 0 and 1, got ${frontmatter.temperature}`);
    }
  }

  // Validate: mode must be one of valid values if present
  if (frontmatter.mode !== undefined) {
    if (!VALID_MODES.includes(frontmatter.mode)) {
      errors.push(`Field "mode" must be one of: ${VALID_MODES.join(', ')}. Got: ${frontmatter.mode}`);
    }
  }

  return {
    file: fileName,
    passed: errors.length === 0,
    errors
  };
}

/**
 * Main validation function
 */
function validate() {
  console.log('Validating OpenCode agent files...\n');

  // Check if agent directory exists
  if (!fs.existsSync(AGENT_DIR)) {
    console.error(`Agent directory not found: ${AGENT_DIR}`);
    process.exit(1);
  }

  // Get all .md files
  const files = fs.readdirSync(AGENT_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No agent files found in', AGENT_DIR);
    process.exit(0);
  }

  console.log(`Found ${files.length} agent file(s)\n`);

  const results: ValidationResult[] = [];

  // Validate each file
  for (const file of files) {
    const filePath = path.join(AGENT_DIR, file);
    const result = validateAgentFile(filePath);
    results.push(result);

    // Output result
    if (result.passed) {
      console.log(`✓ ${result.file}`);
    } else {
      console.log(`✗ ${result.file}`);
      result.errors.forEach(err => console.log(`    - ${err}`));
    }
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n' + '─'.repeat(40));
  console.log(`Summary: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.error('\nValidation FAILED. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\nValidation SUCCESS. All agent files are valid.');
  }
}

validate();
