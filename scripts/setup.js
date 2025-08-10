#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SetupScript {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async checkCommand(command, name) {
    try {
      await execAsync(`${command} --version`);
      return true;
    } catch (error) {
      this.log(`❌ ${name} is not installed or not in PATH`, 'red');
      return false;
    }
  }

  async checkRequirements() {
    this.log('🔍 Checking requirements...', 'cyan');
    
    const requirements = [
      { command: 'node', name: 'Node.js', required: true },
      { command: 'yarn', name: 'Yarn', required: true },
      { command: 'docker', name: 'Docker', required: false },
      { command: 'docker-compose', name: 'Docker Compose', required: false },
    ];

    const results = {};
    
    for (const req of requirements) {
      const available = await this.checkCommand(req.command, req.name);
      results[req.command] = available;
      
      if (available) {
        try {
          const { stdout } = await execAsync(`${req.command} --version`);
          const version = stdout.trim().split('\n')[0];
          this.log(`✅ ${req.name}: ${version}`, 'green');
        } catch {
          this.log(`✅ ${req.name}: Available`, 'green');
        }
      } else if (req.required) {
        this.log(`Please install ${req.name} first.`, 'red');
        process.exit(1);
      }
    }

    return results;
  }

  async checkNodeVersion() {
    try {
      const { stdout } = await execAsync('node --version');
      const version = stdout.trim();
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        this.log(`❌ Node.js version 18+ required. Current: ${version}`, 'red');
        process.exit(1);
      }
      
      return version;
    } catch (error) {
      this.log('❌ Unable to check Node.js version', 'red');
      process.exit(1);
    }
  }

  async installDependencies() {
    this.log('📦 Installing dependencies...', 'cyan');
    
    return new Promise((resolve, reject) => {
      const install = spawn('yarn', ['install'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          this.log('✅ Dependencies installed successfully', 'green');
          resolve();
        } else {
          this.log('❌ Failed to install dependencies', 'red');
          reject(new Error(`yarn install failed with code ${code}`));
        }
      });
    });
  }

  async buildPackages() {
    this.log('🔨 Building packages...', 'cyan');
    
    return new Promise((resolve, reject) => {
      const build = spawn('yarn', ['build'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      build.on('close', async (code) => {
        if (code === 0) {
          this.log('✅ Packages built successfully', 'green');
          
          // Ensure API dist folder exists (workaround for TypeScript emit issue)
          try {
            const fs = require('fs');
            const apiDistPath = 'apps/api/dist';
            if (!fs.existsSync(apiDistPath)) {
              this.log('🔧 Fixing API build output...', 'cyan');
              await execAsync('npx tsc -p apps/api/tsconfig.build.json --noEmitOnError false');
              this.log('✅ API build fixed', 'green');
            }
          } catch (error) {
            this.log(`⚠️  API build fix failed: ${error.message}`, 'yellow');
          }
          
          resolve();
        } else {
          this.log('❌ Failed to build packages', 'red');
          reject(new Error(`yarn build failed with code ${code}`));
        }
      });
    });
  }

  async createEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), 'env.example');
    
    if (fs.existsSync(envPath)) {
      this.log('✅ .env file already exists', 'green');
      return;
    }
    
    if (!fs.existsSync(envExamplePath)) {
      this.log('⚠️  env.example not found', 'yellow');
      return;
    }
    
    this.log('📝 Creating .env file from template...', 'cyan');
    fs.copyFileSync(envExamplePath, envPath);
    this.log('✅ .env file created', 'green');
    this.log('⚠️  Please update .env file with your configuration values', 'yellow');
  }

  async setupDocker(hasDocker) {
    if (!hasDocker) {
      this.log('⚠️  Docker not available. You\'ll need to run PostgreSQL manually.', 'yellow');
      this.log('   Install Docker to use the automated setup.', 'yellow');
      return;
    }

    this.log('🐳 Setting up Docker environment...', 'cyan');
    
    // Check if containers are already running
    try {
      const { stdout } = await execAsync('docker-compose -f docker/docker-compose.yml ps postgres');
      if (stdout.includes('Up')) {
        this.log('✅ PostgreSQL container is already running', 'green');
        return;
      }
    } catch {
      // Container not running, continue with setup
    }

    this.log('🚀 Starting PostgreSQL container...', 'cyan');
    
    return new Promise((resolve, reject) => {
      const dockerUp = spawn('docker-compose', [
        '-f', 'docker/docker-compose.yml', 
        'up', '-d', 'postgres'
      ], { 
        stdio: 'inherit',
        shell: true 
      });
      
      dockerUp.on('close', (code) => {
        if (code === 0) {
          this.log('✅ PostgreSQL container started successfully', 'green');
          resolve();
        } else {
          this.log('❌ Failed to start PostgreSQL container', 'red');
          reject(new Error(`docker-compose failed with code ${code}`));
        }
      });
    });
  }

  async waitForDatabase() {
    this.log('⏳ Waiting for database to be ready...', 'cyan');
    
    const maxAttempts = 30;
    const delayMs = 2000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Try to connect using docker exec
        await execAsync('docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U postgres');
        this.log('✅ Database is ready!', 'green');
        return;
      } catch {
        if (attempt === maxAttempts) {
          this.log('❌ Database failed to start within timeout', 'red');
          throw new Error('Database startup timeout');
        }
        
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  async runMigrations() {
    this.log('🔄 Running database migrations...', 'cyan');
    
    const migrationsPath = path.join(process.cwd(), 'apps/api/dist/migrations');
    
    if (!fs.existsSync(migrationsPath)) {
      this.log('⚠️  No migrations found. Building API first...', 'yellow');
      
      return new Promise((resolve, reject) => {
        const build = spawn('yarn', ['workspace', '@gitlumen/api', 'build'], { 
          stdio: 'inherit',
          shell: true 
        });
        
        build.on('close', (code) => {
          if (code === 0) {
            this.log('✅ API built successfully', 'green');
            this.runMigrationsCommand().then(resolve).catch(reject);
          } else {
            this.log('❌ Failed to build API', 'red');
            reject(new Error(`API build failed with code ${code}`));
          }
        });
      });
    }
    
    return this.runMigrationsCommand();
  }

  async runMigrationsCommand() {
    return new Promise((resolve, reject) => {
      const migrate = spawn('yarn', ['workspace', '@gitlumen/api', 'migration:run'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      migrate.on('close', (code) => {
        if (code === 0) {
          this.log('✅ Migrations completed successfully', 'green');
          resolve();
        } else {
          this.log('⚠️  Migrations may have failed or no migrations to run', 'yellow');
          resolve(); // Don't fail the setup for migration issues
        }
      });
    });
  }

  async printNextSteps(hasDocker) {
    this.log('\n🎉 Setup complete!', 'green');
    this.log('\nNext steps:', 'bright');
    
    if (hasDocker) {
      this.log('1. Database is running in Docker container', 'cyan');
    } else {
      this.log('1. Start PostgreSQL manually:', 'cyan');
      this.log('   - Install PostgreSQL locally, or', 'yellow');
      this.log('   - Install Docker and rerun this script', 'yellow');
    }
    
    this.log('2. Start the development servers:', 'cyan');
    this.log('   yarn dev        # Start all services', 'yellow');
    this.log('   OR separately:', 'yellow');
    this.log('   yarn workspace @gitlumen/api start:dev    # API only', 'yellow');
    this.log('   yarn workspace @gitlumen/web dev          # Web only', 'yellow');
    
    if (hasDocker) {
      this.log('\n3. Docker commands:', 'cyan');
      this.log('   yarn docker:up     # Start all services in Docker', 'yellow');
      this.log('   yarn docker:down   # Stop all services', 'yellow');
      this.log('   yarn docker:logs   # View logs', 'yellow');
    }
    
    this.log('\n4. Access the application:', 'cyan');
    this.log('   API: http://localhost:3001', 'yellow');
    this.log('   Web: http://localhost:3000', 'yellow');
    this.log('   Health: http://localhost:3001/api/v1/health', 'yellow');
  }

  async run() {
    try {
      this.log('🚀 GitLumen Development Setup', 'bright');
      this.log('================================\n', 'bright');
      
      const requirements = await this.checkRequirements();
      await this.checkNodeVersion();
      await this.installDependencies();
      await this.buildPackages();
      await this.createEnvFile();
      
      if (requirements.docker && requirements['docker-compose']) {
        await this.setupDocker(true);
        await this.waitForDatabase();
        await this.runMigrations();
        await this.printNextSteps(true);
      } else {
        await this.printNextSteps(false);
      }
      
    } catch (error) {
      this.log(`\n❌ Setup failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  const setup = new SetupScript();
  setup.run();
}

module.exports = SetupScript;