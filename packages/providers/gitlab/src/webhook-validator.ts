import * as crypto from 'crypto';
import { JsonObject } from '@gitlumen/core';

export class GitLabWebhookValidator {
  private webhookSecret: string;

  constructor(webhookSecret: string) {
    this.webhookSecret = webhookSecret;
  }

  validate(payload: JsonObject, signature: string): boolean {
    if (!this.webhookSecret || !signature) {
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

  private generateHmacSignature(payload: JsonObject): string {
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
