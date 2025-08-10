/**
 * Data Transfer Object types for API endpoints
 * These types define the structure of request/response data
 */

import { JsonObject, MetadataObject, HttpHeaders } from './common.types';

// Organization DTOs
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  description?: string;
  settings?: JsonObject;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  settings?: JsonObject;
  isActive?: boolean;
}

export interface OrganizationResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  settings?: JsonObject;
  createdAt: Date;
  updatedAt: Date;
}

// Project DTOs
export interface CreateProjectDto {
  organizationId: string;
  providerConfigId: string;
  name: string;
  slug: string;
  description?: string;
  externalId: string;
  webUrl: string;
  defaultBranch?: string;
  metadata?: MetadataObject;
}

export interface ProjectQueryDto {
  organizationId?: string;
  providerConfigId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProjectResponseDto {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Webhook DTOs
export interface WebhookPayloadDto extends JsonObject {
  // Generic webhook payload structure
  // Specific providers will extend this
}

export interface WebhookHeadersDto extends HttpHeaders {
  'x-gitlab-token'?: string;
  'x-gitlab-event'?: string;
  'x-github-delivery'?: string;
  'x-github-event'?: string;
  'x-hub-signature-256'?: string;
}

// Event DTOs
export interface EventDto {
  id: string;
  type: string;
  projectId: string;
  timestamp: Date;
  metadata?: MetadataObject;
}

// Notification DTOs
export interface NotificationEventDto {
  id: string;
  type: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  author: string;
  url: string;
  timestamp: Date;
  metadata?: MetadataObject;
}

// Generic response types
export interface GenericResponseDto {
  id: string;
  success?: boolean;
  message?: string;
}

export interface TestConnectionResponseDto {
  id: string;
  ok: boolean;
  error?: string;
  metadata?: MetadataObject;
}
