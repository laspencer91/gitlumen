import { Injectable, Logger } from '@nestjs/common';
import { WebhooksServicePort } from './webhooks.service.port';
import { ProvidersServicePort } from '../providers/providers.service.port';
import { ProjectsServicePort } from '../projects/projects.service.port';
import { EventProcessorService } from '../events/event-processor.service';
import { GenericResponseDto, JsonObject, ProviderRuntimeConfig } from '@gitlumen/core';

const MOCK_PROVIDER_CONFIG: ProviderRuntimeConfig = {
  id: 'gitlab-provider-id',
  name: 'GitLab Provider',
  type: 'gitlab',
  baseUrl: 'https://gitlab.com',
  accessToken: process.env.GITLAB_TOKEN || '',
  webhookSecret: process.env.GITLAB_WEBHOOK_SECRET,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Injectable()
export class WebhooksService extends WebhooksServicePort {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private providersService: ProvidersServicePort,
    private eventProcessor: EventProcessorService,
    private projectsService: ProjectsServicePort,
  ) {
    super();
  }

  async handleWebhook(
    projectId: string,
    eventType: string,
    eventId: string,
    headers: Record<string, string>,
    body: JsonObject
  ): Promise<GenericResponseDto> {
    this.logger.log(`Processing GitLab webhook: ${eventType} for project ${projectId}`);

    // TODO: Future implementation:
    // 1. Validate webhook signature
    // 2. Parse webhook into internal event format
    // 3. Run through event enrichment pipeline
    // 4. Send to notification plugins
    // 5. Store in event log

    // const project = await this.projectsService.findOneWithProvider(projectId);
    // if (!project || !project.isActive) {
    //   return {
    //     id: eventId,
    //     success: false,
    //     message: 'Project not found or inactive',
    //   };
    // }

    try {
      // TODO: Get provider config from database based on projectId
      const providerConfig = MOCK_PROVIDER_CONFIG;

      // Get provider instance
      const provider = await this.providersService.getProvider(providerConfig.type, providerConfig);

      // Validate webhook signature
      if (!provider.validateWebhook(body, headers)) {
        this.logger.warn('Invalid webhook signature');
        return {
          id: eventId,
          success: false,
          message: 'Invalid webhook signature',
        };
      }

      // Parse the webhook into a provider event
      const developmentEvent = provider.parseEvent(body);

      // Process the event through the events system
      await this.eventProcessor.processDevelopmentEvent(developmentEvent);

      return {
        id: eventId,
        success: true,
        message: `GitLab ${eventType} webhook processed successfully`,
      };

    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      this.logger.error(`Failed to process GitLab webhook: ${errorMessage}`);
      return {
        id: eventId,
        success: false,
        message: `Failed to process webhook: ${errorMessage}`,
      };
    }
  }
}

