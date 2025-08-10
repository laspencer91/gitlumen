import { Injectable, Logger } from '@nestjs/common';
import { EventsServicePort } from './events.service.port';
import { EventDto } from '@gitlumen/core';
import { EventHandlers } from './event.handlers';

@Injectable()
export class EventsService extends EventsServicePort {
  private readonly logger = new Logger(EventsService.name);

  constructor(private eventHandlers: EventHandlers) {
    super();
  }

  async emitMergeRequestEvent(event: EventDto): Promise<void> {
    this.logger.log(`Emitting merge request event: ${event.id}`);
    
    // For now, directly call the handler
    // In a more complex implementation, you might:
    // - Store the event in an event log
    // - Use a message queue
    // - Emit via EventEmitter2
    await this.eventHandlers.handleMergeRequestEvent(event);
  }
}

