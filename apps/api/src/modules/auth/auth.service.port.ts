/**
 * Auth Service Port
 *
 * Purpose: Manages API authentication and authorization for the GitLumen platform.
 *
 * Description: Handles generation, validation, and lifecycle of API keys used to secure
 * access to the GitLumen API. Provides a simple, secure mechanism for service-to-service
 * communication and leaves room for additional strategies (OAuth2/SAML) in the future.
 *
 * Key Responsibilities:
 * - Generate secure API keys for organizations
 * - Validate API keys on incoming requests
 * - Manage API key lifecycle (creation, rotation, revocation)
 * - Provide guards/helpers for protecting routes
 * - Enable future integration with OAuth2/SAML
 */
export abstract class AuthServicePort {
  abstract generateApiKey(organizationId: string): Promise<string>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;
}

