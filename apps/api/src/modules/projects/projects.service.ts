import { Injectable } from '@nestjs/common';
import { ProjectsServicePort } from './projects.service.port';

@Injectable()
export class ProjectsService extends ProjectsServicePort {
  async create(dto: any) {
    // TODO: Validate provider, persist project
    return { id: 'proj_' + Date.now(), ...dto };
  }

  async findAll(query: any) {
    // TODO: Fetch from DB with pagination
    return { items: [], total: 0 };
  }

  async testConnection(id: string) {
    // TODO: Resolve provider and test
    return { id, ok: true };
  }
}

