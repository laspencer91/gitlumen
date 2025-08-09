import { Injectable } from '@nestjs/common';
import { Provider } from '@gitlumen/core';
import { ProviderFactory } from './provider.factory';
import { ProvidersServicePort } from './providers.service.port';

@Injectable()
export class ProvidersService extends ProvidersServicePort {
  constructor(private providerFactory: ProviderFactory) {
    super();
  }

  async getProvider(type: string): Promise<Provider> {
    return this.providerFactory.getProvider(type);
  }
}

