import { Module, DynamicModule, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginConfig, ProjectPluginConfig } from '../../entities';
import { PluginFactory } from './plugin.factory';
import { PluginsService } from './plugins.service';
import { GitLumenPlugin, REGISTERED_PLUGINS } from '@gitlumen/core';

@Module({})
export class PluginsModule {
  static forRoot(plugins: Type<GitLumenPlugin>[]): DynamicModule {
    return {
      module: PluginsModule,
      imports: [
        TypeOrmModule.forFeature([PluginConfig, ProjectPluginConfig]),
      ],
      providers: [
        {
          provide: REGISTERED_PLUGINS,
          useValue: plugins,
        },
        PluginFactory,
        PluginsService,
      ],
      exports: [PluginsService, PluginFactory],
    };
  }
}


