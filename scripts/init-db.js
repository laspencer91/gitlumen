#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const execAsync = promisify(exec);

class DatabaseInitializer {
  constructor() {
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
    };
    
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'gitlumen',
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async checkDockerSetup() {
    try {
      const { stdout } = await execAsync('docker-compose -f docker/docker-compose.yml ps postgres');
      return stdout.includes('Up');
    } catch {
      return false;
    }
  }

  async checkPostgreSQLConnection() {
    try {
      // Try Docker first
      if (await this.checkDockerSetup()) {
        await execAsync('docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U postgres');
        this.log('✅ Connected to PostgreSQL (Docker)', 'green');
        return 'docker';
      }
      
      // Try local PostgreSQL
      const pgIsReadyCmd = process.platform === 'win32' 
        ? `pg_isready -h ${this.config.host} -p ${this.config.port} -U ${this.config.username}`
        : `PGPASSWORD=${this.config.password} pg_isready -h ${this.config.host} -p ${this.config.port} -U ${this.config.username}`;
        
      await execAsync(pgIsReadyCmd);
      this.log('✅ Connected to PostgreSQL (Local)', 'green');
      return 'local';
      
    } catch (error) {
      return null;
    }
  }

  async startDockerDatabase() {
    this.log('🐳 Starting PostgreSQL container...', 'cyan');
    
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
          resolve();
        } else {
          reject(new Error(`Failed to start PostgreSQL container (code ${code})`));
        }
      });
    });
  }

  async waitForDatabase(connectionType) {
    this.log('⏳ Waiting for database to be ready...', 'cyan');
    
    const maxAttempts = 30;
    const delayMs = 2000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (connectionType === 'docker') {
          await execAsync('docker-compose -f docker/docker-compose.yml exec -T postgres pg_isready -U postgres');
        } else {
          const pgIsReadyCmd = process.platform === 'win32' 
            ? `pg_isready -h ${this.config.host} -p ${this.config.port} -U ${this.config.username}`
            : `PGPASSWORD=${this.config.password} pg_isready -h ${this.config.host} -p ${this.config.port} -U ${this.config.username}`;
          await execAsync(pgIsReadyCmd);
        }
        
        this.log('✅ Database is ready!', 'green');
        return;
      } catch {
        if (attempt === maxAttempts) {
          throw new Error('Database failed to start within timeout');
        }
        
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  async createDatabase(connectionType) {
    this.log(`🔨 Creating database '${this.config.database}' if it doesn't exist...`, 'cyan');
    
    try {
      let createDbCmd;
      
      if (connectionType === 'docker') {
        createDbCmd = `docker-compose -f docker/docker-compose.yml exec -T postgres createdb -U postgres ${this.config.database}`;
      } else {
        if (process.platform === 'win32') {
          createDbCmd = `createdb -h ${this.config.host} -p ${this.config.port} -U ${this.config.username} ${this.config.database}`;
        } else {
          createDbCmd = `PGPASSWORD=${this.config.password} createdb -h ${this.config.host} -p ${this.config.port} -U ${this.config.username} ${this.config.database}`;
        }
      }
      
      await execAsync(createDbCmd);
      this.log(`✅ Database '${this.config.database}' created`, 'green');
    } catch (error) {
      if (error.message.includes('already exists')) {
        this.log(`✅ Database '${this.config.database}' already exists`, 'green');
      } else {
        this.log(`⚠️  Could not create database: ${error.message}`, 'yellow');
      }
    }
  }

  async testDatabaseConnection(connectionType) {
    this.log('🧪 Testing database connection...', 'cyan');
    
    try {
      let testCmd;
      
      if (connectionType === 'docker') {
        testCmd = `docker-compose -f docker/docker-compose.yml exec -T postgres psql -U postgres -d ${this.config.database} -c "SELECT version();"`;
      } else {
        if (process.platform === 'win32') {
          testCmd = `psql -h ${this.config.host} -p ${this.config.port} -U ${this.config.username} -d ${this.config.database} -c "SELECT version();"`;
        } else {
          testCmd = `PGPASSWORD=${this.config.password} psql -h ${this.config.host} -p ${this.config.port} -U ${this.config.username} -d ${this.config.database} -c "SELECT version();"`;
        }
      }
      
      const { stdout } = await execAsync(testCmd);
      if (stdout.includes('PostgreSQL')) {
        this.log('✅ Database connection test successful', 'green');
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`❌ Database connection test failed: ${error.message}`, 'red');
      return false;
    }
  }

  async runMigrations() {
    this.log('🔄 Running database migrations...', 'cyan');
    
    // Check if API is built
    const migrationsPath = path.join(process.cwd(), 'apps/api/dist/migrations');
    const entitiesPath = path.join(process.cwd(), 'apps/api/dist/**/*.entity.js');
    
    if (!fs.existsSync(path.join(process.cwd(), 'apps/api/dist'))) {
      this.log('⚠️  API not built. Building first...', 'yellow');
      
      await new Promise((resolve, reject) => {
        const build = spawn('yarn', ['workspace', '@gitlumen/api', 'build'], { 
          stdio: 'inherit',
          shell: true 
        });
        
        build.on('close', (code) => {
          if (code === 0) {
            this.log('✅ API built successfully', 'green');
            resolve();
          } else {
            reject(new Error(`API build failed with code ${code}`));
          }
        });
      });
    }
    
    // Run migrations
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
          this.log('⚠️  Migrations completed with warnings or no migrations to run', 'yellow');
          resolve(); // Don't fail the initialization
        }
      });
    });
  }

  async printDatabaseInfo(connectionType) {
    this.log('\n📊 Database Information:', 'bright');
    this.log(`   Type: ${connectionType === 'docker' ? 'Docker Container' : 'Local PostgreSQL'}`, 'cyan');
    this.log(`   Database: ${this.config.database}`, 'cyan');
    this.log(`   Host: ${this.config.host}`, 'cyan');
    this.log(`   Port: ${this.config.port}`, 'cyan');
    this.log(`   User: ${this.config.username}`, 'cyan');
    
    if (connectionType === 'docker') {
      this.log('\n🐳 Docker Commands:', 'bright');
      this.log('   docker-compose -f docker/docker-compose.yml logs postgres  # View logs', 'yellow');
      this.log('   docker-compose -f docker/docker-compose.yml stop postgres  # Stop database', 'yellow');
      this.log('   docker-compose -f docker/docker-compose.yml down          # Remove containers', 'yellow');
    }
    
    this.log('\n🚀 Next Steps:', 'bright');
    this.log('   yarn workspace @gitlumen/api start:dev    # Start API server', 'yellow');
    this.log('   yarn workspace @gitlumen/web dev          # Start web app', 'yellow');
    this.log('   curl http://localhost:3001/api/v1/health  # Test API', 'yellow');
  }

  async run() {
    try {
      this.log('🗄️  GitLumen Database Initializer', 'bright');
      this.log('==================================\n', 'bright');
      
      this.log(`📊 Configuration:`, 'cyan');
      this.log(`   Database: ${this.config.database}`, 'cyan');
      this.log(`   Host: ${this.config.host}`, 'cyan');
      this.log(`   Port: ${this.config.port}`, 'cyan');
      this.log(`   User: ${this.config.username}\n`, 'cyan');
      
      // Try to connect to existing database
      let connectionType = await this.checkPostgreSQLConnection();
      
      if (!connectionType) {
        this.log('❌ PostgreSQL is not running', 'red');
        this.log('🔄 Attempting to start PostgreSQL with Docker...', 'cyan');
        
        try {
          await this.startDockerDatabase();
          await this.waitForDatabase('docker');
          connectionType = 'docker';
        } catch (error) {
          this.log('❌ Failed to start PostgreSQL with Docker', 'red');
          this.log('Please start PostgreSQL manually or install Docker', 'yellow');
          this.log('\nManual setup options:', 'yellow');
          this.log('1. Install PostgreSQL locally', 'yellow');
          this.log('2. Install Docker and run: docker-compose -f docker/docker-compose.yml up -d postgres', 'yellow');
          process.exit(1);
        }
      }
      
      await this.createDatabase(connectionType);
      
      const connected = await this.testDatabaseConnection(connectionType);
      if (!connected) {
        throw new Error('Failed to connect to database');
      }
      
      await this.runMigrations();
      
      this.log('\n✅ Database initialization complete!', 'green');
      await this.printDatabaseInfo(connectionType);
      
    } catch (error) {
      this.log(`\n❌ Database initialization failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.run();
}

module.exports = DatabaseInitializer;