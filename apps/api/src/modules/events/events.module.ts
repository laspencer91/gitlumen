import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventHandlers } from './event.handlers';
import { EventProcessorService } from './event-processor.service';
import { EventsServicePort } from './events.service.port';

@Module({
  providers: [
    { provide: EventsServicePort, useClass: EventsService },
    EventHandlers,
    EventProcessorService,
  ],
  exports: [EventsServicePort, EventProcessorService],
})
export class EventsModule {}

