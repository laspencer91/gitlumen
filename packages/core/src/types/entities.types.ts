export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  providerId: string;
  externalId: string;
  webUrl: string;
  defaultBranch: string;
  visibility: 'public' | 'private' | 'internal';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderConfigEntity {
  id: string;
  organizationId: string;
  name: string;
  type: 'gitlab' | 'github' | 'bitbucket';
  baseUrl: string;
  accessToken: string;
  webhookSecret?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PluginConfigEntity {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  isActive: boolean;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventLog {
  id: string;
  organizationId: string;
  projectId: string;
  providerId: string;
  eventType: string;
  eventData: Record<string, any>;
  processed: boolean;
  processedAt?: Date;
  createdAt: Date;
} 