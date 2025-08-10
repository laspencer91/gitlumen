import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions as TypeOrmModuleOptions),
    HealthModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    ProvidersModule,
    WebhooksModule,
    NotificationsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 