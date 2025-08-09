import { Injectable } from '@nestjs/common';
import { NotificationsServicePort } from './notifications.service.port';

@Injectable()
export class NotificationsService extends NotificationsServicePort {
  async sendNotification(projectId: string, event: any): Promise<void> {
    // TODO: Load enabled plugins for project; dispatch notifications
  }
}

