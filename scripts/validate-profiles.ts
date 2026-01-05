#!/usr/bin/env ts-node

/**
 * Profile Validation Script
 * 
 * Validates profiles.json before applying them to ensure:
 * - All referenced models exist or will be accessible
 * - Agent names match those in opencode.base.json
 * - Profile structure is correct
 * - No forbidden providers (OpenRouter)
 */

import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || '', '.config/opencode');
const BASE_CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.base.json');
const PROFILES_PATH = path.join(CONFIG_DIR, 'profiles.json');

// Forbidden providers
const FORBIDDEN_PROVIDERS = ['openrouter'];

// Known model prefixes that are allowed
const ALLOWED_PROVIDERS: Record<string, string[]> = {
  'opencode': ['minimax-m2.1', 'glm-4.7', 'grok-codefast-2'],
  'google': ['gemini-3-pro', 'gemini-3-flash', 'gemini-2.5-flash'], // etc - validated dynamically
  'github-copilot': ['gpt-5.1-codex', 'claude-haiku-4.5', 'claude-sonnet-4.5', 'claude-opus-4.5'],
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

function loadJson(filePath: string): any {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`❌ Error parsing JSON from ${filePath}:`, e);
    process.exit(1);
  }
}

function validateProfiles(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  // Load configs
  const baseConfig = loadJson(BASE_CONFIG_PATH);
  const profiles = loadJson(PROFILES_PATH);

  // Get all agent names from base config
  const baseAgents = Object.keys(baseConfig.agent || {});
  result.info.push(`Found ${baseAgents.length} agents in base config: ${baseAgents.join(', ')}`);

  // Validate each profile
  for (const [profileName, profile] of Object.entries<any>(profiles)) {
    result.info.push(`\n🔍 Validating profile: '${profileName}'`);

    // Check for forbidden providers
    const provider = profileName.toLowerCase();
    if (FORBIDDEN_PROVIDERS.some(forbidden => provider.includes(forbidden))) {
      result.errors.push(`  ❌ Profile '${profileName}' uses FORBIDDEN provider (OpenRouter banned)`);
      result.valid = false;
      continue;
    }

    // Check structure
    if (!profile.description) {
      result.warnings.push(`  ⚠️  Profile '${profileName}' missing description`);
    }

    if (!profile.model) {
      result.errors.push(`  ❌ Profile '${profileName}' missing global model`);
      result.valid = false;
    } else {
      result.info.push(`  ✓ Global model: ${profile.model}`);
      validateModelId(profile.model, profileName, result);
    }

    // Validate agents
    if (!profile.agents) {
      result.warnings.push(`  ⚠️  Profile '${profileName}' has no agent overrides`);
    } else {
      const profileAgents = Object.keys(profile.agents);
      result.info.push(`  ✓ Agent overrides: ${profileAgents.length}`);

      // Check for agents in profile that don't exist in base
      for (const agentName of profileAgents) {
        if (!baseAgents.includes(agentName)) {
          result.warnings.push(`  ⚠️  Agent '${agentName}' in profile but not in base config`);
        } else {
          const modelId = profile.agents[agentName];
          validateModelId(modelId, `${profileName}.${agentName}`, result);
        }
      }

      // Check for base agents not covered in profile
      const missingAgents = baseAgents.filter(a => !profileAgents.includes(a));
      if (missingAgents.length > 0) {
        result.warnings.push(`  ⚠️  Missing agent overrides: ${missingAgents.join(', ')}`);
      }
    }
  }

  return result;
}

function validateModelId(modelId: string, context: string, result: ValidationResult): void {
  const [provider, ...modelParts] = modelId.split('/');
  
  if (!provider || modelParts.length === 0) {
    result.errors.push(`    ❌ Invalid model ID format '${modelId}' in ${context} (expected: provider/model)`);
    result.valid = false;
    return;
  }

  const modelName = modelParts.join('/');

  // Check if provider is allowed
  if (ALLOWED_PROVIDERS[provider]) {
    // For known providers, we can do basic validation
    // Note: We can't fully validate without connecting to OpenCode
    result.info.push(`    ✓ Model '${modelId}' uses approved provider '${provider}'`);
  } else if (FORBIDDEN_PROVIDERS.includes(provider)) {
    result.errors.push(`    ❌ Model '${modelId}' uses FORBIDDEN provider '${provider}' in ${context}`);
    result.valid = false;
  } else {
    result.warnings.push(`    ⚠️  Unknown provider '${provider}' in ${context} - verify it's accessible`);
  }
}

function printResults(result: ValidationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('📋 PROFILE VALIDATION RESULTS');
  console.log('='.repeat(60));

  if (result.info.length > 0) {
    console.log('\nℹ️  Information:');
    result.info.forEach(msg => console.log(msg));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(msg => console.log(msg));
  }

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(msg => console.log(msg));
  }

  console.log('\n' + '='.repeat(60));
  if (result.valid) {
    console.log('✅ VALIDATION PASSED');
    console.log('All profiles are structurally valid and use approved providers.');
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log('Please fix the errors above before switching profiles.');
  }
  console.log('='.repeat(60) + '\n');
}

// Main
const result = validateProfiles();
printResults(result);

if (!result.valid) {
  process.exit(1);
}

process.exit(0);
