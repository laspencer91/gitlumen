import { JsonObject } from '../types/common.types';
import { DevelopmentEvent } from '../types/event.types';

export interface ProviderRuntimeConfig {
  id: string;
  name: string;
  type: 'gitlab' | 'github' | 'bitbucket';
  baseUrl: string;
  accessToken: string;
  webhookSecret?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProvider<PAYLOAD = JsonObject, HEADERS = Record<string, string>> {
  id: string;
  name: string;
  type: string;
  validateWebhook(payload: PAYLOAD, headers: HEADERS): boolean;
  parseEvent(payload: PAYLOAD): DevelopmentEvent<any>;
  getProjectInfo(projectId: string): Promise<ProjectInfo>;
}

// DevelopmentEvent is now defined in development-events.types.ts

export interface ProjectInfo {
  id: string;
  name: string;
  description?: string;
  webUrl: string;
  defaultBranch: string;
  visibility: 'public' | 'private' | 'internal';
}
