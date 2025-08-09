import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProviderFactory } from './provider.factory';
import { ProvidersServicePort } from './providers.service.port';

@Module({
  providers: [
    ProviderFactory,
    { provide: ProvidersServicePort, useClass: ProvidersService },
  ],
  exports: [ProvidersServicePort],
})
export class ProvidersModule {}

