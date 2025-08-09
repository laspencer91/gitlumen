export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectRecord {
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

export interface TeamMemberRecord {
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

export interface ProviderConfigRecord {
  id: string;
  organizationId: string;
  name: string;
  type: 'gitlab' | 'github' | 'bitbucket';
  baseUrl: string;
  accessToken: string; // expect encrypted at rest
  webhookSecret?: string; // expect encrypted at rest
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PluginConfigRecord {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  isActive: boolean;
  config: Record<string, any>; // expect encrypted/sanitized where needed
  createdAt: Date;
  updatedAt: Date;
}

export interface EventLogRecord {
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

