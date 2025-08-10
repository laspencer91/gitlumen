export interface PluginMetadata {
  type: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;
}

export function Plugin(metadata: PluginMetadata): ClassDecorator {
  return (target: any) => {
    target.pluginType = metadata.type;
    target.pluginName = metadata.name;
    target.pluginDescription = metadata.description;
    target.pluginVersion = metadata.version;
    target.pluginAuthor = metadata.author;
  };
}


