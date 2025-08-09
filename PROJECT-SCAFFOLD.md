gitlumen/
├── apps/
│   ├── api/                              # NestJS API + Worker
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/                # API key authentication
│   │   │   │   ├── projects/            # Project CRUD
│   │   │   │   ├── webhooks/            # Webhook receiver
│   │   │   │   ├── teams/               # Team member management
│   │   │   │   ├── notifications/       # Plugin orchestrator
│   │   │   │   └── health/              # Health checks
│   │   │   ├── entities/                # TypeORM entities
│   │   │   │   ├── organization.entity.ts
│   │   │   │   ├── project.entity.ts
│   │   │   │   ├── team-member.entity.ts
│   │   │   │   ├── provider-config.entity.ts
│   │   │   │   ├── plugin-config.entity.ts
│   │   │   │   └── event-log.entity.ts
│   │   │   ├── config/
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── app.config.ts
│   │   │   │   └── typeorm.config.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── migrations/
│   │   ├── test/
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── web/                              # Next.js UI
│       ├── app/
│       │   ├── (dashboard)/
│       │   │   ├── projects/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [id]/
│       │   │   │       ├── page.tsx
│       │   │   │       ├── settings/page.tsx
│       │   │   │       └── members/page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── api/                     # BFF if needed
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       │   ├── projects/
│       │   ├── teams/
│       │   └── ui/
│       ├── lib/
│       │   ├── api-client.ts
│       │   └── utils.ts
│       ├── .env.example
│       ├── .eslintrc.js
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── core/                            # Domain models & interfaces
│   │   ├── src/
│   │   │   ├── interfaces/
│   │   │   │   ├── provider.interface.ts
│   │   │   │   ├── plugin.interface.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── events.types.ts
│   │   │   │   ├── config.types.ts
│   │   │   │   └── entities.types.ts
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── providers/
│   │   └── gitlab/                      # GitLab provider
│   │       ├── src/
│   │       │   ├── gitlab.provider.ts
│   │       │   ├── webhook-validator.ts
│   │       │   ├── event-parser.ts
│   │       │   ├── api-client.ts
│   │       │   └── index.ts
│   │       ├── __tests__/
│   │       ├── .eslintrc.js
│   │       ├── tsconfig.json
│   │       └── package.json
│   │
│   ├── plugins/
│   │   └── teams/                       # Teams notification plugin
│   │       ├── src/
│   │       │   ├── teams.plugin.ts
│   │       │   ├── message-formatter.ts
│   │       │   ├── teams-client.ts
│   │       │   └── index.ts
│   │       ├── __tests__/
│   │       ├── .eslintrc.js
│   │       ├── tsconfig.json
│   │       └── package.json
│   │
│   └── shared/                          # Shared utilities
│       ├── src/
│       │   ├── utils/
│       │   │   ├── encryption.ts
│       │   │   ├── logger.ts
│       │   │   └── validators.ts
│       │   ├── constants.ts
│       │   └── index.ts
│       ├── .eslintrc.js
│       ├── tsconfig.json
│       └── package.json
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── docs/
│   ├── getting-started/
│   │   ├── quick-start.md
│   │   ├── installation.md
│   │   └── configuration.md
│   ├── guides/
│   │   ├── gitlab-setup.md
│   │   └── teams-setup.md
│   └── README.md
│
├── scripts/
│   ├── setup.sh
│   ├── generate-api-key.js
│   └── init-db.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
│
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── .env.example
├── turbo.json
├── package.json
├── yarn.lock
├── tsconfig.json
├── LICENSE
└── README.md