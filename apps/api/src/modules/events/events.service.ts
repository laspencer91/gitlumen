import { Injectable } from '@nestjs/common';
import { EventsServicePort } from './events.service.port';

@Injectable()
export class EventsService extends EventsServicePort {
  async emitMergeRequestEvent(event: any): Promise<void> {
    // TODO: Log + emit via Nest EventEmitter
  }
}

