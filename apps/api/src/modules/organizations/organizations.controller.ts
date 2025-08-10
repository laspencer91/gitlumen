import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationsServicePort } from './organizations.service.port';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateOrganizationDto, UpdateOrganizationDto } from '@gitlumen/core';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(ApiKeyGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsServicePort) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() dto: CreateOrganizationDto) {
    // TODO: Implement organization creation
    return this.organizationsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}

