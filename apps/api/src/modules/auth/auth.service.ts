import { Injectable } from '@nestjs/common';
import { AuthServicePort } from './auth.service.port';

@Injectable()
export class AuthService extends AuthServicePort {
  async generateApiKey(organizationId: string): Promise<string> {
    // TODO: Generate secure API key, hash + store associated to organizationId
    return `gl_${organizationId}_${Date.now()}`;
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    // TODO: Validate API key against database (constant-time compare)
    return !!apiKey;
  }
}

