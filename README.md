# GitLumen 🚀

A comprehensive development analytics platform that monitors GitLab merge requests and sends intelligent notifications to Microsoft Teams.

## 🎯 Project Overview

GitLumen is designed to provide real-time insights into your development workflow by:
- **Monitoring** GitLab merge requests and development activity
- **Notifying** team members through Microsoft Teams
- **Analyzing** development patterns and team productivity
- **Scaling** from small teams to enterprise organizations

## 🏗️ Architecture

This is a monorepo built with:
- **Backend**: NestJS API with TypeORM and PostgreSQL
- **Frontend**: Next.js 14+ with Tailwind CSS
- **Monorepo**: Turborepo with Yarn workspaces
- **Language**: TypeScript 5+
- **Container**: Docker with multi-stage builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn (v1, not Yarn 2+)
- PostgreSQL 15+
- Docker (optional, for containerized development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gitlumen
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the project**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start API
   yarn workspace @gitlumen/api start:dev
   
   # Terminal 2: Start Web app
   yarn workspace @gitlumen/web dev
   ```

### Using Docker

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

## 📁 Project Structure

```
gitlumen/
├── apps/
│   ├── api/                    # NestJS API + Worker
│   └── web/                    # Next.js UI
├── packages/
│   ├── core/                   # Domain models & interfaces
│   ├── providers/              # GitLab provider
│   ├── plugins/                # Teams notification plugin
│   └── shared/                 # Shared utilities
├── docker/                     # Docker configuration
├── scripts/                    # Setup and utility scripts
└── docs/                       # Documentation
```

## 🔧 Development

### Available Scripts

- `yarn dev` - Start all development servers
- `yarn build` - Build all packages and apps
- `yarn lint` - Run linting across all packages
- `yarn typecheck` - Run TypeScript type checking
- `yarn format` - Format code with Prettier
- `yarn clean` - Clean all build artifacts

### API Development

```bash
# Generate migration
yarn workspace @gitlumen/api migration:generate -- -n MigrationName

# Run migrations
yarn workspace @gitlumen/api migration:run

# Revert migration
yarn workspace @gitlumen/api migration:revert
```

### Web Development

```bash
# Start development server
yarn workspace @gitlumen/web dev

# Build for production
yarn workspace @gitlumen/web build
```

## 🌐 API Endpoints

The API is available at `http://localhost:3001/api/v1` with the following endpoints:

- `GET /health` - Health check
- `POST /webhooks/gitlab` - GitLab webhook receiver
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /teams` - List team members
- `POST /teams` - Add team member

## 🔐 Authentication

GitLumen uses API key authentication. Generate a new API key:

```bash
node scripts/generate-api-key.js
```

## 📊 Database

The application uses PostgreSQL with the following main entities:

- **Organizations** - Top-level organization structure
- **Projects** - GitLab projects being monitored
- **Team Members** - Users and their notification preferences
- **Provider Configs** - GitLab integration settings
- **Plugin Configs** - Teams notification settings
- **Event Logs** - Audit trail of all activities

## 🚢 Deployment

### Production Build

```bash
# Build all packages
yarn build

# Start production servers
yarn workspace @gitlumen/api start:prod
yarn workspace @gitlumen/web start
```

### Docker Production

```bash
# Build and start production containers
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join the conversation in GitHub Discussions

## 🔮 Roadmap

- [ ] GitHub integration
- [ ] Slack notifications
- [ ] Advanced analytics dashboard
- [ ] Team performance metrics
- [ ] Custom notification rules
- [ ] Webhook filtering
- [ ] Multi-tenant support
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Backup and restore

---

Built with ❤️ by the GitLumen team 