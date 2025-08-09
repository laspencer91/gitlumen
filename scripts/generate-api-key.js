#!/usr/bin/env node

const crypto = require('crypto');

function generateApiKey() {
  // Generate a random 32-byte key
  const apiKey = crypto.randomBytes(32).toString('hex');
  
  // Add a prefix for identification
  const prefixedKey = `gl_${apiKey}`;
  
  return prefixedKey;
}

function generateSalt() {
  // Generate a random 16-byte salt
  const salt = crypto.randomBytes(16).toString('hex');
  return salt;
}

function main() {
  console.log('🔑 GitLumen API Key Generator\n');
  
  const apiKey = generateApiKey();
  const salt = generateSalt();
  
  console.log('Generated API Key:');
  console.log(`  ${apiKey}\n`);
  
  console.log('Generated Salt (add to .env):');
  console.log(`  API_KEY_SALT=${salt}\n`);
  
  console.log('⚠️  Important:');
  console.log('  - Store the API key securely');
  console.log('  - Update your .env file with the salt');
  console.log('  - Never commit API keys to version control');
  console.log('  - Use different keys for different environments\n');
  
  console.log('Example .env entry:');
  console.log(`  API_KEY_SALT=${salt}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateApiKey, generateSalt }; 