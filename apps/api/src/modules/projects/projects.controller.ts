import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsServicePort } from './projects.service.port';
import { ProvidersService } from '../providers/providers.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateProjectDto, ProjectQueryDto } from '@gitlumen/core';

@ApiTags('projects')
@Controller('projects')
@UseGuards(ApiKeyGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsServicePort,
    private readonly providersService: ProvidersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects' })
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Post(':id/test-connection')
  @ApiOperation({ summary: 'Test provider connection' })
  async testConnection(@Param('id') id: string) {
    return this.projectsService.testConnection(id);
  }
}

