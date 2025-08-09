import { Injectable } from '@nestjs/common';
import { Provider, ProviderRuntimeConfig } from '@gitlumen/core';
import { GitLabProvider } from '@gitlumen/provider-gitlab';

/**
 * Provider Factory
 *
 * Purpose: Adapter registry that creates provider instances by type.
 *
 * Description: Centralizes provider construction and mapping, enabling
 * support for multiple VCS providers behind a single creation interface.
 */

@Injectable()
export class ProviderFactory {
  private providers: Map<string, (config: ProviderRuntimeConfig) => Provider> = new Map();

  constructor() {
    this.providers.set('gitlab', (config) => new GitLabProvider(config));
  }

  getProvider(type: string, config?: ProviderRuntimeConfig): Provider {
    const creator = this.providers.get(type);
    if (!creator) {
      throw new Error(`Provider ${type} not found`);
    }
    if (!config) {
      // In real impl, fetch config from DB and map to runtime config
      throw new Error('Provider config not provided');
    }
    return creator(config);
  }
}

