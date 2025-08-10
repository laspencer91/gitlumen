/**
 * Utility types for GitLab webhook definitions
 */

/**
 * Allows literal string types while still providing autocompletion
 */
export type LiteralUnion<T extends string> = T | (string & {});

/**
 * Compare type for tracking changes in webhook events
 */
export interface Compare<T> {
  previous: T;
  current: T;
}

/**
 * Generic webhook response structure
 */
export interface WebhookResponse {
  success: boolean;
  message: string;
  timestamp: string;
  event_id?: string;
}

/**
 * Event processing metadata
 */
export interface EventProcessingMeta {
  received_at: Date;
  processed_at?: Date;
  processing_duration_ms?: number;
  enrichers_applied?: string[];
  errors?: string[];
}