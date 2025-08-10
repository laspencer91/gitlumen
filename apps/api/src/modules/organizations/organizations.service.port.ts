import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto, GenericResponseDto } from '@gitlumen/core';

/**
 * Organizations Service Port
 *
 * Purpose: Manages organization accounts and their system-wide settings.
 *
 * Description: Top-level tenant management. Each organization represents a customer/team
 * using GitLumen. Handles creation, configuration, and provides parent context for all
 * projects and users.
 *
 * Key Responsibilities:
 * - Create and manage organization accounts
 * - Store organization-wide settings and preferences
 * - Manage organization API keys
 * - Provide organization context for all operations
 * - Handle billing/subscription management (future)
 */
export abstract class OrganizationsServicePort {
  abstract create(dto: CreateOrganizationDto): Promise<OrganizationResponseDto>;
  abstract findOne(id: string): Promise<OrganizationResponseDto>;
  abstract update(id: string, dto: UpdateOrganizationDto): Promise<OrganizationResponseDto>;
  abstract remove(id: string): Promise<GenericResponseDto>;
}

