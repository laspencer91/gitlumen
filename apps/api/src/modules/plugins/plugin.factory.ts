import { Injectable, Inject, Type } from '@nestjs/common';
import { INotificationPlugin, PluginRuntimeConfig, PluginConstructor, REGISTERED_PLUGINS } from '@gitlumen/core';

@Injectable()
export class PluginFactory {
  private pluginMap = new Map<string, PluginConstructor>();

  constructor(
    @Inject(REGISTERED_PLUGINS) plugins: Type<INotificationPlugin>[],
  ) {
    plugins.forEach((PluginClass) => {
      const pluginType = (PluginClass as any).pluginType;
      if (!pluginType) {
        throw new Error(
          `Plugin ${PluginClass.name} must use @Plugin decorator or have static pluginType property`,
        );
      }
      this.pluginMap.set(pluginType, PluginClass as unknown as PluginConstructor);
    });
  }

  create(config: PluginRuntimeConfig): INotificationPlugin {
    const PluginClass = this.pluginMap.get(config.type);

    if (!PluginClass) {
      const available = Array.from(this.pluginMap.keys()).join(', ');
      throw new Error(
        `Unknown plugin type: ${config.type}. Available types: ${available}`,
      );
    }

    return new PluginClass(config);
  }

  getAvailablePlugins(): Array<{
    type: string;
    name: string;
    description?: string;
    version?: string;
    author?: string;
  }> {
    return Array.from(this.pluginMap.entries()).map(([type, PluginClass]) => ({
      type,
      name: (PluginClass as any).pluginName,
      description: (PluginClass as any).pluginDescription,
      version: (PluginClass as any).pluginVersion,
      author: (PluginClass as any).pluginAuthor,
    }));
  }
}


