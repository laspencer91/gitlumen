import { Injectable } from '@nestjs/common';
import { PluginsServicePort } from './plugins.service.port';
import { INotificationPlugin, PluginRuntimeConfig } from '@gitlumen/core/dist';
import { ProjectPluginConfig } from '../../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PluginFactory } from './plugin.factory';

@Injectable()
export class PluginsService extends PluginsServicePort {
  constructor(private readonly factory: PluginFactory,
              @InjectRepository(ProjectPluginConfig)
              private readonly projectPluginConfigRepo: Repository<ProjectPluginConfig>
  ) {
    super();
  }

  async getEnabledPluginConfigsForProject(projectId: string): Promise<PluginRuntimeConfig[]> {
    // Query the database joining all necessary tables
    const projectPluginConfigs = await this.projectPluginConfigRepo.find({
      where: {
        projectId,
        isEnabled: true,
        pluginConfig: {
          isActive: true, // Global plugin must also be active
        },
      },
      relations: ['pluginConfig'], // Load the parent plugin config
    });

    // Transform to runtime configs
    return projectPluginConfigs.map(ppc => this.toRuntimeConfig(ppc));
  }

  private toRuntimeConfig(projectPluginConfig: ProjectPluginConfig): PluginRuntimeConfig {
    const { pluginConfig } = projectPluginConfig;

    // Merge global config with project-specific overrides
    const mergedConfig = {
      ...pluginConfig.config, // Global config
      ...projectPluginConfig.config, // Project-specific overrides
    };

    return {
      id: pluginConfig.id,
      name: pluginConfig.name,
      type: pluginConfig.type,
      isActive: pluginConfig.isActive && projectPluginConfig.isEnabled,
      config: mergedConfig,
      createdAt: pluginConfig.createdAt,
      updatedAt: pluginConfig.updatedAt,
    };
  }

  async getEnabledPluginsForProject(projectId: string): Promise<INotificationPlugin[]> {
    const configs = await this.getEnabledPluginConfigsForProject(projectId);
    return configs.map((cfg) => this.factory.create(cfg));
  }
}


