import { GenericResponseDto, JsonObject } from '@gitlumen/core';

/**
 * Webhooks Service Port
 *
 * Purpose: Receives and processes incoming webhooks from version control providers.
 *
 * Description: Validates incoming webhooks, parses provider-specific payloads, and
 * converts them into normalized internal events for further processing.
 *
 * Key Responsibilities:
 * - Receive webhook HTTP requests
 * - Validate webhook signatures for security
 * - Parse provider-specific payloads
 * - Normalize to a common event format
 * - Route to the event processing system
 * - Handle webhook errors and retries
 */
export abstract class WebhooksServicePort {
  abstract handleWebhook(
    projectId: string,
    eventType: string,
    eventId: string,
    headers: Record<string, string>,
    body: JsonObject
  ): Promise<GenericResponseDto>;
}

