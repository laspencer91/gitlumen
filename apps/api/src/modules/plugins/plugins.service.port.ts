import { INotificationPlugin, PluginRuntimeConfig } from '@gitlumen/core/dist';

export abstract class PluginsServicePort {
  abstract getEnabledPluginConfigsForProject(projectId: string): Promise<PluginRuntimeConfig[]>;
  abstract getEnabledPluginsForProject(projectId: string): Promise<INotificationPlugin[]>;
}


