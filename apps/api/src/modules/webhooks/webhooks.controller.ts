import { Controller, Post, Param, Headers, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhooksServicePort } from './webhooks.service.port';
import { WebhookHeadersDto, WebhookPayloadDto } from '@gitlumen/core';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksServicePort) {}

  @Post('gitlab/:projectId')
  @ApiOperation({ summary: 'Receive GitLab webhook' })
  async handleGitLabWebhook(
    @Param('projectId') projectId: string,
    @Headers() headers: WebhookHeadersDto,
    @Body() body: WebhookPayloadDto,
  ) {
    // TODO: Validate + parse + emit
    return this.webhooksService.handleGitlab(projectId, headers, body);
  }
}

