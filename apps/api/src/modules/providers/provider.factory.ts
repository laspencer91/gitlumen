import { Injectable } from '@nestjs/common';
import { IProvider, ProviderRuntimeConfig } from '@gitlumen/core';
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
  private providers: Map<string, (config: ProviderRuntimeConfig) => IProvider<unknown, unknown>> = new Map();

  constructor() {
    this.providers.set('gitlab', (config) => new GitLabProvider(config));
  }

  getProvider(type: string, config?: ProviderRuntimeConfig): IProvider {
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

