import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventHandlers } from './event.handlers';
import { EventsServicePort } from './events.service.port';

@Module({
  providers: [
    { provide: EventsServicePort, useClass: EventsService },
    EventHandlers,
  ],
  exports: [EventsServicePort],
})
export class EventsModule {}

