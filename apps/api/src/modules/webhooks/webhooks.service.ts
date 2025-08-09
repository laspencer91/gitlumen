import { Injectable } from '@nestjs/common';
import { WebhooksServicePort } from './webhooks.service.port';

@Injectable()
export class WebhooksService extends WebhooksServicePort {
  async handleGitlab(projectId: string, headers: any, body: any) {
    // TODO: Validate signature, parse event, enqueue/emit
    return { projectId, received: true };
  }
}

