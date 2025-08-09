import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsServicePort } from './notifications.service.port';

@Module({
  providers: [
    { provide: NotificationsServicePort, useClass: NotificationsService },
  ],
  exports: [NotificationsServicePort],
})
export class NotificationsModule {}

