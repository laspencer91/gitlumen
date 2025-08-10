import { EventDto } from '@gitlumen/core';

/**
 * Events Service Port
 *
 * Purpose: Manages event processing pipeline and event storage.
 *
 * Description: Central nervous system of GitLumen—emits and handles internal events,
 * persists audit trail, filters and enables replay/statistics.
 *
 * Key Responsibilities:
 * - Emit and handle internal events
 * - Store event history for auditing
 * - Filter based on configuration
 * - Provide replay capabilities
 * - Generate event statistics
 * - Power event-driven workflows
 */
export abstract class EventsServicePort {
  abstract emitMergeRequestEvent(event: EventDto): Promise<void>;
}

