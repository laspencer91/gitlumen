import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProvidersModule } from '../providers/providers.module';
import { ProjectsServicePort } from './projects.service.port';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProvidersModule, AuthModule],
  controllers: [ProjectsController],
  providers: [
    { provide: ProjectsServicePort, useClass: ProjectsService },
  ],
  exports: [ProjectsServicePort],
})
export class ProjectsModule {}

