import { Injectable } from '@nestjs/common';
import { EventsServicePort } from './events.service.port';
import { EventDto } from '@gitlumen/core';

@Injectable()
export class EventsService extends EventsServicePort {
  async emitMergeRequestEvent(event: EventDto): Promise<void> {
    // TODO: Log + emit via Nest EventEmitter
  }
}

