import { ConfigObject, MetadataObject, JsonObject, HttpHeaders } from './common.types';

// Base entity interface
export interface BaseEntityData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Organization entities
export interface OrganizationData extends BaseEntityData {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  settings?: JsonObject;
}

export interface OrganizationMemberData extends BaseEntityData {
  organizationId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  isActive: boolean;
  invitedAt?: Date;
  acceptedAt?: Date;
}

// Authentication entities
export interface ApiKeyData extends BaseEntityData {
  organizationId: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  permissions?: string[];
}

// Project entities
export interface ProjectData extends BaseEntityData {
  organizationId: string;
  providerConfigId: string;
  name: string;
  slug: string;
  description?: string;
  externalId: string;
  webUrl: string;
  defaultBranch?: string;
  webhookId: string;
  lastSyncedAt?: Date;
  isActive: boolean;
  metadata?: MetadataObject;
}

export interface ProjectTeamMemberData extends BaseEntityData {
  projectId: string;
  externalUserId: string;
  username: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  accessLevel?: 'developer' | 'maintainer' | 'owner' | 'guest';
  isTracked: boolean;
  metadata?: MetadataObject;
}

export interface ProjectEventSubscriptionData extends BaseEntityData {
  projectId: string;
  eventType: string;
  isEnabled: boolean;
  filters?: JsonObject;
}

// Provider entities
export interface ProviderConfigData extends BaseEntityData {
  organizationId: string;
  name: string;
  type: 'gitlab' | 'github' | 'bitbucket';
  baseUrl: string;
  accessToken: string;
  webhookSecret?: string;
  isActive: boolean;
  metadata?: MetadataObject;
}

// Plugin entities
export interface PluginConfigData extends BaseEntityData {
  organizationId: string;
  name: string;
  type: string;
  isActive: boolean;
  config: ConfigObject;
}

export interface ProjectPluginConfigData extends BaseEntityData {
  projectId: string;
  pluginConfigId: string;
  isEnabled: boolean;
  config: ConfigObject;
}

// Event entities
export interface EventLogData extends BaseEntityData {
  organizationId: string;
  projectId: string;
  providerConfigId: string;
  eventType: string;
  eventSourceId?: string;
  authorExternalId?: string;
  eventData: JsonObject;
  status: 'pending' | 'processed' | 'failed';
  error?: string;
  processedAt?: Date;
  metadata?: MetadataObject;
}

export interface WebhookDeliveryData extends BaseEntityData {
  projectId: string;
  eventLogId?: string;
  webhookUrl: string;
  headers: HttpHeaders;
  payload: JsonObject;
  responseStatus?: number;
  responseHeaders?: HttpHeaders;
  responseBody?: string;
  duration: number;
  isValid: boolean;
} 