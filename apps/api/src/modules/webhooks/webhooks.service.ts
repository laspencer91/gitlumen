import { Injectable, Logger } from '@nestjs/common';
import { WebhooksServicePort } from './webhooks.service.port';
import { GenericResponseDto } from '@gitlumen/core';
import type { 
  GitLabWebhookEvents, 
  GitLabWebhookHeaders, 
  GitLabEventType 
} from '@gitlumen/provider-gitlab';

@Injectable()
export class WebhooksService extends WebhooksServicePort {
  private readonly logger = new Logger(WebhooksService.name);

  async handleGitlab(
    projectId: string,
    eventType: GitLabEventType,
    eventId: string,
    headers: GitLabWebhookHeaders & Record<string, string>,
    body: GitLabWebhookEvents
  ): Promise<GenericResponseDto> {
    this.logger.log(`Processing GitLab webhook: ${eventType} for project ${projectId}`);

    // Log the webhook data for now
    console.log('\n🔍 === PRODUCTION GITLAB WEBHOOK ===');
    console.log(`📋 Project ID: ${projectId}`);
    console.log(`🎯 Event Type: ${eventType}`);
    console.log(`🆔 Event ID: ${eventId}`);
    console.log(`📊 Payload:`, JSON.stringify(body, null, 2));
    console.log('=======================================\n');

    // TODO: Future implementation:
    // 1. Validate webhook signature
    // 2. Parse webhook into internal event format
    // 3. Run through event enrichment pipeline
    // 4. Send to notification plugins
    // 5. Store in event log

    return {
      id: eventId,
      success: true,
      message: `GitLab ${eventType} webhook received and logged`,
    };
  }
}

