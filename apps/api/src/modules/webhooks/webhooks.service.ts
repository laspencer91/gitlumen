import { Injectable } from '@nestjs/common';
import { WebhooksServicePort } from './webhooks.service.port';
import { WebhookHeadersDto, WebhookPayloadDto, GenericResponseDto } from '@gitlumen/core';

@Injectable()
export class WebhooksService extends WebhooksServicePort {
  async handleGitlab(projectId: string, headers: WebhookHeadersDto, body: WebhookPayloadDto): Promise<GenericResponseDto> {
    // TODO: Validate signature, parse event, enqueue/emit
    return { id: projectId, success: true, message: 'Webhook received' };
  }
}

