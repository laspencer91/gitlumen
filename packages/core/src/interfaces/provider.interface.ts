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

export interface Provider {
  id: string;
  name: string;
  type: string;
  validateWebhook(payload: any, signature: string): boolean;
  parseEvent(payload: any): ProviderEvent;
  getProjectInfo(projectId: string): Promise<ProjectInfo>;
}

export interface ProviderEvent {
  id: string;
  type: string;
  projectId: string;
  projectName: string;
  branch: string;
  author: string;
  title: string;
  description?: string;
  url: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description?: string;
  webUrl: string;
  defaultBranch: string;
  visibility: 'public' | 'private' | 'internal';
} 