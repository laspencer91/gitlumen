import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { AuthServicePort } from './auth.service.port';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: AuthServicePort, useClass: AuthService },
    ApiKeyGuard,
    ApiKeyStrategy
  ],
  exports: [AuthServicePort, ApiKeyGuard],
})
export class AuthModule {}

