import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProvidersModule } from '../providers/providers.module';
import { ProjectsServicePort } from './projects.service.port';

@Module({
  imports: [ProvidersModule],
  controllers: [ProjectsController],
  providers: [
    { provide: ProjectsServicePort, useClass: ProjectsService },
  ],
  exports: [ProjectsServicePort],
})
export class ProjectsModule {}

