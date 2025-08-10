import { Injectable } from '@nestjs/common';
import { NotificationsServicePort } from './notifications.service.port';
import { NotificationEventDto } from '@gitlumen/core';

@Injectable()
export class NotificationsService extends NotificationsServicePort {
  async sendNotification(projectId: string, event: NotificationEventDto): Promise<void> {
    // TODO: Load enabled plugins for project; dispatch notifications
  }
}

