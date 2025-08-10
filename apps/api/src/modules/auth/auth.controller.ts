import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthServicePort } from './auth.service.port';

class GenerateApiKeyDto {
  organizationId!: string;
}

class ValidateApiKeyDto {
  apiKey!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServicePort) {}

  @Post('generate-api-key')
  @ApiOperation({ summary: 'Generate a new API key for an organization' })
  async generateApiKey(@Body() dto: GenerateApiKeyDto) {
    // TODO: Implement API key generation
    return { apiKey: await this.authService.generateApiKey(dto.organizationId) };
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate an API key' })
  async validateApiKey(@Body() dto: ValidateApiKeyDto) {
    // TODO: Implement API key validation
    return { valid: await this.authService.validateApiKey(dto.apiKey) };
  }
}

