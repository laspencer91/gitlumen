import { NotificationEventDto } from '@gitlumen/core';

/**
 * Notifications Service Port
 *
 * Purpose: Orchestrates delivery of notifications through communication channels.
 *
 * Description: Manages notification pipeline—eligibility, routing, delivery—using
 * configured plugins (Teams, Slack, Email). Responsible for status, throttling,
 * batching, and templating.
 *
 * Key Responsibilities:
 * - Process events for notification eligibility
 * - Load project notification configs
 * - Route notifications to appropriate plugins
 * - Handle delivery status/errors
 * - Implement throttling/batching
 * - Manage templates
 */
export abstract class NotificationsServicePort {
  abstract sendNotification(projectId: string, event: NotificationEventDto): Promise<void>;
}

