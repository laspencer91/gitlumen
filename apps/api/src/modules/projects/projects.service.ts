import { Injectable } from '@nestjs/common';
import { ProjectsServicePort } from './projects.service.port';
import { CreateProjectDto, ProjectQueryDto, ProjectResponseDto, PaginatedResponse, TestConnectionResponseDto } from '@gitlumen/core';

@Injectable()
export class ProjectsService extends ProjectsServicePort {
  async create(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    // TODO: Validate provider, persist project
    const now = new Date();
    return {
      id: 'proj_' + Date.now(),
      webhookId: 'webhook_' + Date.now(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...dto,
    };
  }

  async findAll(query: ProjectQueryDto): Promise<PaginatedResponse<ProjectResponseDto>> {
    // TODO: Fetch from DB with pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    return {
      items: [],
      total: 0,
      page,
      limit,
      hasNext: false,
      hasPrev: false,
    };
  }

  async testConnection(id: string): Promise<TestConnectionResponseDto> {
    // TODO: Resolve provider and test
    return { id, ok: true };
  }
}

