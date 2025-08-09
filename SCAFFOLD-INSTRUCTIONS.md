# GitLumen Project Setup Instructions for Cursor AI (UPDATED)

## Project Overview
You are setting up **GitLumen**, a monorepo application that monitors GitLab merge requests and sends notifications to Microsoft Teams. This is v1 of what will become a comprehensive development analytics platform.

## Technology Stack
- **Monorepo Tool**: Turborepo with Yarn workspaces
- **Apps**: 
  - API: NestJS with TypeORM and PostgreSQL
  - Web: Next.js 14+ (App Router) with Tailwind CSS 3+
- **Language**: TypeScript 5+
- **Package Manager**: Yarn (v1, not Yarn 2+)
- **Code Quality**: ESLint, Prettier
- **Container**: Docker with multi-stage builds

## Critical Setup Instructions

### 1. Initialize Monorepo
```bash
# Create root directory and initialize
mkdir gitlumen && cd gitlumen
yarn init -y

# Set package.json to private and configure workspaces
# Add to package.json:
{
  "name": "gitlumen",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 2. Install Root Dependencies (EXACT VERSIONS MATTER)
```bash
# Turborepo and build tools
yarn add -D turbo@latest

# TypeScript and types
yarn add -D typescript@^5.3.0 @types/node@^20.0.0

# ESLint with TypeScript support
yarn add -D eslint@^8.56.0 @typescript-eslint/parser@^6.19.0 @typescript-eslint/eslint-plugin@^6.19.0 eslint-config-prettier@^9.1.0

# Prettier
yarn add -D prettier@^3.2.0

# Additional dev tools
yarn add -D rimraf concurrently
```

### 3. Root Configuration Files

**turbo.json** (IMPORTANT: Use correct schema and pipeline configuration)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    }
  }
}
```

**Root tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "incremental": true,
    "composite": true
  },
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
```

### 4. Create Directory Structure (CORRECTED)
```bash
# Create all directories first to avoid issues
mkdir -p apps/api/src apps/web/app
mkdir -p packages/core/src packages/shared/src
mkdir -p packages/providers/gitlab/src
mkdir -p packages/plugins/teams/src
mkdir -p docker scripts docs
```

### 5. Package Setup Order (IMPORTANT: Order matters for dependencies)

#### A. Core Package First
```bash
cd packages/core
yarn init -y
# Update package.json name to "@gitlumen/core"
yarn add -D typescript @types/node
```

Create `packages/core/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

#### B. Shared Package
```bash
cd ../shared
yarn init -y
# Update package.json name to "@gitlumen/shared"
yarn add -D typescript @types/node
# Add same tsconfig.json structure
```

#### C. API App (NestJS) - UPDATED VERSIONS
```bash
cd ../../apps/api
yarn init -y

# CRITICAL: Install NestJS dependencies with compatible versions
yarn add @nestjs/core@^10.3.0 @nestjs/common@^10.3.0 @nestjs/platform-express@^10.3.0
yarn add @nestjs/config@^3.1.0 @nestjs/typeorm@^11.0.0 typeorm@^0.3.20 pg@^8.11.0
yarn add @nestjs/swagger@^7.2.0 @nestjs/platform-socket.io@^10.3.0
yarn add class-validator@^0.14.0 class-transformer@^0.5.1
yarn add bcrypt@^5.1.0 @types/bcrypt@^5.0.0

# Dev dependencies
yarn add -D @nestjs/cli@^10.3.0 @nestjs/schematics@^10.1.0 @nestjs/testing@^10.3.0
yarn add -D @types/express@^4.17.0 @types/jest@^29.5.0 jest@^29.7.0
yarn add -D ts-jest@^29.1.0 ts-loader@^9.5.0 ts-node@^10.9.0
yarn add -D source-map-support@^0.5.21

# Add workspace dependencies
yarn add @gitlumen/core@* @gitlumen/shared@*
```

Create `apps/api/nest-cli.json`:
```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

#### D. Web App (Next.js) - UPDATED COMMAND
```bash
cd ../web

# IMPORTANT: Use create-next-app for proper setup with all options
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-yarn

# Additional dependencies
yarn add axios@^1.6.0 @tanstack/react-query@^5.17.0
yarn add react-hook-form@^7.48.0 zod@^3.22.0
yarn add lucide-react@^0.309.0

# UI components (optional but recommended)
yarn add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
yarn add clsx tailwind-merge

# Add workspace dependencies
yarn add @gitlumen/core@* @gitlumen/shared@*
```

### 6. Provider and Plugin Packages (CORRECTED PATHS)
```bash
# GitLab Provider
cd ../../packages/providers/gitlab
yarn init -y
# Update name to "@gitlumen/provider-gitlab"
yarn add axios@^1.6.0
yarn add -D typescript @types/node
yarn add @gitlumen/core@*

# Teams Plugin
cd ../../../plugins/teams
yarn init -y
# Update name to "@gitlumen/plugin-teams"
yarn add axios@^1.6.0
yarn add -D typescript @types/node
yarn add @gitlumen/core@*
```

### 7. Common Pitfalls to Avoid

#### TypeORM Configuration (UPDATED FOR 2025)
```typescript
// apps/api/src/config/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gitlumen',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(dataSourceOptions);
```

#### TypeORM Module Configuration in NestJS
```typescript
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    // other modules
  ],
})
export class AppModule {}
```

#### Next.js Configuration
```javascript
// apps/web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gitlumen/core', '@gitlumen/shared'], // CRITICAL for monorepo
  experimental: {
    // Enable if needed
    serverActions: true,
  },
  // Handle CORS for API calls
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 8. ESLint Configuration (Root)
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    '.next',
    '.turbo',
    'coverage',
    '*.js', // Ignore JS config files
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

### 9. Scripts to Add to Root package.json (UPDATED FOR MIGRATIONS)
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "turbo run clean && rimraf node_modules .turbo",
    "db:migrate": "yarn workspace api migration:run",
    "db:generate": "yarn workspace api migration:generate",
    "db:revert": "yarn workspace api migration:revert"
  }
}
```

### 10. API Package.json Scripts for Migrations
```json
// apps/api/package.json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d src/config/data-source.ts",
    "migration:generate": "npm run build && npm run typeorm -- migration:generate",
    "migration:run": "npm run build && npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "migration:show": "npm run typeorm -- migration:show"
  }
}
```

### 11. Environment Variables Setup
Create `.env.example` in root:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gitlumen
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=gitlumen

# API
API_PORT=3001
API_KEY_SALT=change-this-in-production

# GitLab
GITLAB_WEBHOOK_SECRET=your-webhook-secret

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001

# Node
NODE_ENV=development
```

### 12. Docker Configuration
```dockerfile
# docker/Dockerfile
# IMPORTANT: Multi-stage build for optimal size
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock turbo.json ./
COPY apps/*/package.json apps/*/yarn.lock ./apps/
COPY packages/*/package.json packages/*/yarn.lock ./packages/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN yarn build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000 3001

CMD ["node", "apps/api/dist/main.js"]
```

## Verification Steps

1. **Check Workspace Resolution**:
   ```bash
   yarn workspaces info
   ```

2. **Verify TypeScript Compilation**:
   ```bash
   yarn typecheck
   ```

3. **Test Turbo Pipeline**:
   ```bash
   yarn build --dry-run
   ```

4. **Check for Version Conflicts**:
   ```bash
   yarn install --check-files
   ```

## Common Issues and Solutions

1. **Module Resolution Issues**: Ensure `tsconfig.json` has proper `paths` configuration
2. **Turbo Cache Issues**: Run `yarn clean` if builds are inconsistent
3. **TypeORM Entity Loading**: Use absolute paths or glob patterns carefully
4. **Next.js Transpilation**: Always add workspace packages to `transpilePackages`
5. **Port Conflicts**: Ensure API (3001) and Web (3000) ports are free
6. **TypeORM 0.3.x Breaking Changes**: Use DataSource instead of createConnection
7. **Migration Path Issues**: Ensure migrations are in the dist folder for production

## Final Notes
- Always run `yarn install` from the root directory
- Use `yarn workspace <name> add <package>` for workspace-specific dependencies
- Keep all shared types in `@gitlumen/core`
- Run `yarn format` before committing
- Use conventional commits for better changelog generation
- Test migrations in development before deploying to production

This setup ensures a scalable, type-safe monorepo that can grow into your vision of a comprehensive development analytics platform.