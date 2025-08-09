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
  abstract handleGitlab(projectId: string, headers: any, body: any): Promise<any>;
}

