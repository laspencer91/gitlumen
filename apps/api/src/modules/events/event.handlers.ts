import { Injectable } from '@nestjs/common';

@Injectable()
export class EventHandlers {
  async handleMergeRequestEvent(event: any): Promise<void> {
    // TODO: Process MR events
  }
}

