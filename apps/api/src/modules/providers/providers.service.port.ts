import { Provider } from '@gitlumen/core';

/**
 * Providers Service Port
 *
 * Purpose: Abstracts version control provider integrations behind a common interface.
 *
 * Description: Implements adapter pattern for multiple VCS providers. Unifies access
 * to provider operations (GitLab, GitHub, Bitbucket), handling auth, API quirks,
 * and normalization internally.
 *
 * Key Responsibilities:
 * - Provide provider instances by type
 * - Normalize provider data to common formats
 * - Handle provider authentication
 * - Fetch project/member information
 * - Test provider connections
 * - Manage rate limiting per provider
 */
export abstract class ProvidersServicePort {
  abstract getProvider(type: string): Promise<Provider>;
}

