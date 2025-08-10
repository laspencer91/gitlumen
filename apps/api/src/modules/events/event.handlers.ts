import { Injectable } from '@nestjs/common';
import { EventDto } from '@gitlumen/core';

@Injectable()
export class EventHandlers {
  async handleMergeRequestEvent(event: EventDto): Promise<void> {
    // TODO: Process MR events
  }
}

