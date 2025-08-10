import { Controller, Post, Param, Headers, Body, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhooksServicePort } from './webhooks.service.port';
import {
  GitLabWebhookHeaders,
  GitLabEventType,
  GitLabWebhookEvents,
} from '@gitlumen/provider-gitlab';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksServicePort) {}

  @Post('gitlab/:projectId')
  @ApiOperation({ summary: 'Receive GitLab webhook' })
  async handleGitLabWebhook(
    @Param('projectId') projectId: string,
    @Headers() headers: GitLabWebhookHeaders & Record<string, string>,
    @Body() body: GitLabWebhookEvents,
  ) {
    this.logger.log(`Received GitLab webhook for project: ${projectId}`);

    const eventType: GitLabEventType = headers['x-gitlab-event'];
    const eventId = headers['x-request-id'] || `webhook-${Date.now()}`;

    this.logger.debug(`Event Type: ${eventType}, Event ID: ${eventId}`);

    return this.webhooksService.handleGitlab(projectId, eventType, eventId, headers, body);
  }
}

