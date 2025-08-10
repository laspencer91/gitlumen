import * as crypto from 'crypto';
import { GitLabWebhookEvents, SupportedGitLabWebhookEvents } from './webhook-types';
import { GitLabWebhookHeaders } from './types';

export class GitLabWebhookValidator {
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  validate(payload: GitLabWebhookEvents, headers: GitLabWebhookHeaders): boolean {
    if (!this.webhookSecret || !headers) {
      return false;
    }

    const signature = headers['x-gitlab-token'] || null;
    if (!signature) {
      return false;
    }

    if (!payload.object_kind) {
      console.warn('Received gitlab webhook without object_kind property. Validation failed..')
      return false;
    }

    if (!SupportedGitLabWebhookEvents.includes(payload.object_kind as never)) {
      return false;
    }

    try {
      // GitLab sends the webhook secret as a token in the X-Gitlab-Token header
      // We need to compare it directly with our stored secret
      if (signature === this.webhookSecret) {
        return true;
      }

      // Alternative validation using HMAC if GitLab sends a different signature format
      const expectedSignature = this.generateHmacSignature(payload);
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }

  private generateHmacSignature(payload: GitLabWebhookEvents): string {
    const data = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', this.webhookSecret)
      .update(data, 'utf8')
      .digest('hex');
  }

  validateToken(token: string): boolean {
    return token === this.webhookSecret;
  }

  validateSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload, 'utf8')
        .digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}
