import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { ProvidersModule } from '../providers/providers.module';
import { WebhooksServicePort } from './webhooks.service.port';

@Module({
  imports: [ProvidersModule],
  controllers: [WebhooksController],
  providers: [
    { provide: WebhooksServicePort, useClass: WebhooksService },
  ],
})
export class WebhooksModule {}

