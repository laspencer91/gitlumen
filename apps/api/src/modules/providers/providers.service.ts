import { Injectable } from '@nestjs/common';
import { IProvider, ProviderRuntimeConfig } from '@gitlumen/core';
import { ProviderFactory } from './provider.factory';
import { ProvidersServicePort } from './providers.service.port';

@Injectable()
export class ProvidersService extends ProvidersServicePort {
  constructor(private providerFactory: ProviderFactory) {
    super();
  }

  async getProvider(type: string, config?: ProviderRuntimeConfig): Promise<IProvider> {
    return this.providerFactory.getProvider(type, config);
  }
}

