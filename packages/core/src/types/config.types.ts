import { JsonObject } from './common.types';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
}

export interface AppConfig {
  port: number;
  environment: string;
  apiKeySalt: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
}

export interface GitLabConfig {
  baseUrl: string;
  accessToken: string;
  webhookSecret: string;
  apiVersion: string;
}

export interface TeamsConfig {
  webhookUrl: string;
  botName: string;
  botAvatar?: string;
  defaultChannel?: string;
}

export interface NotificationConfig {
  enabled: boolean;
  plugins: {
    teams?: TeamsConfig;
    slack?: JsonObject;
    email?: JsonObject;
  };
} 