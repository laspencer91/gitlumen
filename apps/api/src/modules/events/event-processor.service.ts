import { Injectable, Logger } from '@nestjs/common';
import { AnyDevelopmentEvent } from '@gitlumen/core';
import { EventsServicePort } from './events.service.port';
import { PluginsServicePort } from '../plugins/plugins.service.port';

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(
    private eventsService: EventsServicePort,
    private pluginsService: PluginsServicePort,
  ) {}

  async processDevelopmentEvent(event: AnyDevelopmentEvent): Promise<void> {
    this.logger.log(`Processing ${event.type} event for project ${event.projectId}`);

    const plugins = await this.pluginsService.getEnabledPluginsForProject(event.projectId);

    if (plugins.length === 0) {
      this.logger.log(`No plugins enabled for project ${event.projectId}`);
      return;
    }

    try {
      await Promise.all(
        plugins.map(async (plugin) => {
          switch (event.type) {
            case 'merge_request':
              await plugin.onMergeRequestEvent?.(event as any);
              break;
            case 'pipeline':
              await plugin.onPipelineEvent?.(event as any);
              break;
            case 'issue':
              await plugin.onIssueEvent?.(event as any);
              break;
            case 'push':
              await plugin.onPushEvent?.(event as any);
              break;
            case 'tag_push':
              await plugin.onTagPushEvent?.(event as any);
              break;
            default:
              this.logger.log(`Generic ${event.type} event processed`);
          }
        })
      );

      this.logger.log(`Successfully processed ${event.type} event: ${event.id}`);

    } catch (error) {
      this.logger.error(`Failed to process provider event ${event.id}: ${(error as Error).message}`);
      throw error;
    }
  }
}
