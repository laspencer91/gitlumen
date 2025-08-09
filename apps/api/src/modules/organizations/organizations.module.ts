import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationsServicePort } from './organizations.service.port';

@Module({
  controllers: [OrganizationsController],
  providers: [
    { provide: OrganizationsServicePort, useClass: OrganizationsService },
  ],
  exports: [OrganizationsServicePort],
})
export class OrganizationsModule {}

