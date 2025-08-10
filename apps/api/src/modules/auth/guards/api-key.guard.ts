import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthServicePort } from '../auth.service.port';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private authService: AuthServicePort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string | undefined;
    if (!apiKey) return false;
    return this.authService.validateApiKey(apiKey);
  }
}

