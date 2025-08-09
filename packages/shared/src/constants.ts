export const APP_CONSTANTS = {
  NAME: 'GitLumen',
  VERSION: '1.0.0',
  DESCRIPTION: 'GitLab monitoring and notification platform',
} as const;

export const API_CONSTANTS = {
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: 'localhost',
  API_PREFIX: '/api/v1',
  MAX_REQUEST_SIZE: '10mb',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // requests per window
} as const;

export const DATABASE_CONSTANTS = {
  DEFAULT_PORT: 5432,
  DEFAULT_HOST: 'localhost',
  DEFAULT_NAME: 'gitlumen',
  CONNECTION_TIMEOUT: 30000,
  QUERY_TIMEOUT: 10000,
  MAX_CONNECTIONS: 20,
  MIN_CONNECTIONS: 5,
} as const;

export const GITLAB_CONSTANTS = {
  DEFAULT_API_VERSION: 'v4',
  WEBHOOK_EVENTS: [
    'Push Hook',
    'Merge Request Hook',
    'Pipeline Hook',
    'Issue Hook',
    'Note Hook',
    'Tag Push Hook',
  ],
  MERGE_REQUEST_STATES: ['opened', 'merged', 'closed'] as const,
  PIPELINE_STATUSES: ['pending', 'running', 'success', 'failed', 'canceled'] as const,
} as const;

export const TEAMS_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_ATTACHMENTS: 10,
  DEFAULT_COLOR: '#0078D4',
  SUCCESS_COLOR: '#107C10',
  WARNING_COLOR: '#FF8C00',
  ERROR_COLOR: '#D13438',
} as const;

export const NOTIFICATION_CONSTANTS = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000, // 5 seconds
  BATCH_SIZE: 50,
  PROCESSING_TIMEOUT: 30000, // 30 seconds
} as const;

export const SECURITY_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_API_KEY_LENGTH: 32,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

export const CACHE_CONSTANTS = {
  DEFAULT_TTL: 300, // 5 minutes
  MAX_SIZE: 1000,
  CLEANUP_INTERVAL: 60 * 1000, // 1 minute
} as const; 