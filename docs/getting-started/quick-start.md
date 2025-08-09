# Quick Start Guide 🚀

Get GitLumen up and running in under 10 minutes!

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Yarn** - Install with `npm install -g yarn`
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/) or use Docker

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd gitlumen

# Install dependencies
yarn install

# Copy environment file
cp env.example .env
```

## Step 2: Configure Environment

Edit `.env` file with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_NAME=gitlumen

# API
API_PORT=3001
API_KEY_SALT=your-salt-here

# GitLab
GITLAB_WEBHOOK_SECRET=your-webhook-secret

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 3: Start Database

### Option A: Local PostgreSQL
```bash
# Start PostgreSQL service
# On macOS: brew services start postgresql
# On Ubuntu: sudo systemctl start postgresql
# On Windows: Start PostgreSQL service from Services

# Create database
createdb gitlumen
```

### Option B: Docker (Recommended)
```bash
# Start only PostgreSQL
docker-compose -f docker/docker-compose.yml up -d postgres

# Wait for database to be ready
docker-compose -f docker/docker-compose.yml logs postgres
```

## Step 4: Start Development Servers

```bash
# Terminal 1: Start API
yarn workspace @gitlumen/api start:dev

# Terminal 2: Start Web app
yarn workspace @gitlumen/web dev
```

## Step 5: Verify Installation

- **API**: http://localhost:3001/api/v1/health
- **Web App**: http://localhost:3000

## 🎉 You're Ready!

Your GitLumen instance is now running! Next steps:

1. **Configure GitLab Integration** - See [GitLab Setup Guide](../guides/gitlab-setup.md)
2. **Set up Teams Notifications** - See [Teams Setup Guide](../guides/teams-setup.md)
3. **Create Your First Project** - Use the web interface at http://localhost:3000

## 🆘 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Check what's using the port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change ports in .env
```

**Database connection failed**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify credentials in .env
# Test connection manually
psql -h localhost -U postgres -d gitlumen
```

**Build errors**
```bash
# Clean and rebuild
yarn clean
yarn install
yarn build
```

### Getting Help

- Check the [main README](../../README.md)
- Review [configuration guide](configuration.md)
- Open an issue on GitHub
- Join our community discussions

## 🚀 Next Steps

- [Configuration Guide](configuration.md)
- [GitLab Integration](../guides/gitlab-setup.md)
- [Teams Setup](../guides/teams-setup.md)
- [API Reference](../api-reference.md) 