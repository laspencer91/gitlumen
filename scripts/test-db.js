#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DatabaseTester {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async testHealthEndpoint() {
    this.log('🩺 Testing API health endpoint...', 'cyan');
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/health');
      if (response.ok) {
        const data = await response.json();
        this.log('✅ API health check passed', 'green');
        this.log(`   Status: ${data.status}`, 'green');
        this.log(`   Timestamp: ${data.timestamp}`, 'green');
        return true;
      } else {
        this.log(`❌ API health check failed: ${response.status}`, 'red');
        return false;
      }
    } catch (error) {
      this.log(`❌ API health check failed: ${error.message}`, 'red');
      this.log('   Make sure the API is running: yarn workspace @gitlumen/api dev', 'yellow');
      return false;
    }
  }

  async testDatabaseConnection() {
    this.log('🗄️  Testing database connection...', 'cyan');
    
    try {
      // Try Docker first
      await execAsync('docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U postgres');
      
      // Test actual connection
      const { stdout } = await execAsync('docker-compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d gitlumen -c "SELECT version();"');
      
      if (stdout.includes('PostgreSQL')) {
        this.log('✅ Database connection successful', 'green');
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`❌ Database connection failed: ${error.message}`, 'red');
      this.log('   Make sure PostgreSQL is running: yarn docker:postgres', 'yellow');
      return false;
    }
  }

  async run() {
    this.log('🧪 GitLumen System Test', 'cyan');
    this.log('======================\n', 'cyan');
    
    const dbTest = await this.testDatabaseConnection();
    const apiTest = await this.testHealthEndpoint();
    
    this.log('\n📊 Test Results:', 'cyan');
    this.log(`   Database: ${dbTest ? '✅ PASS' : '❌ FAIL'}`, dbTest ? 'green' : 'red');
    this.log(`   API Health: ${apiTest ? '✅ PASS' : '❌ FAIL'}`, apiTest ? 'green' : 'red');
    
    if (dbTest && apiTest) {
      this.log('\n🎉 All tests passed! GitLumen is ready for development.', 'green');
      this.log('\nNext steps:', 'cyan');
      this.log('   1. Visit http://localhost:3001/api/v1/health', 'yellow');
      this.log('   2. Start the web app: yarn workspace @gitlumen/web dev', 'yellow');
      this.log('   3. Visit http://localhost:3000', 'yellow');
    } else {
      this.log('\n⚠️  Some tests failed. Please check the setup:', 'yellow');
      if (!dbTest) {
        this.log('   - Run: yarn docker:postgres', 'yellow');
        this.log('   - Or: yarn db:init', 'yellow');
      }
      if (!apiTest) {
        this.log('   - Run: yarn workspace @gitlumen/api dev', 'yellow');
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const tester = new DatabaseTester();
  tester.run();
}

module.exports = DatabaseTester;