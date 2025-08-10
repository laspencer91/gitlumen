import { Controller, Post, Param, Headers, Body, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhooksServicePort } from './webhooks.service.port';
import { JsonObject } from '@gitlumen/core';
import { GitLabEventType, GitLabWebhookEvents, GitLabWebhookHeaders } from '@gitlumen/provider-gitlab';

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

    // W know the types at this point, but our service handles the data agnostically, so we need to widen the types.
    return this.webhooksService.handleWebhook(projectId, eventType, eventId, headers, body as unknown as JsonObject);
  }

  @Post('github/:projectId')
  @ApiOperation({ summary: 'Receive Github webhook' })
  async handleGitHubWebhook(
    @Param('projectId') projectId: string,
    @Headers() headers: Record<string, string>,
    @Body() body: JsonObject,
  ) {
    this.logger.log(`Received Github webhook for project: ${projectId}. UNIMPLEMENTED...`);
    return this.webhooksService.handleWebhook(projectId, 'unknown', 'unknown', headers, body);
  }
}

