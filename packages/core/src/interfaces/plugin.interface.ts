import { ConfigObject, MetadataObject, JsonObject } from '../types';
import {
  MergeRequestDevelopmentEvent,
  PipelineDevelopmentEvent,
  IssueDevelopmentEvent,
  PushDevelopmentEvent,
  TagPushDevelopmentEvent,
  NoteDevelopmentEvent,
} from '../types';

export interface PluginRuntimeConfig {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  config: ConfigObject;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy interface removed in favor of INotificationPlugin

export interface NotificationEvent {
  id: string;
  type: 'merge_request' | 'pipeline' | 'deployment' | 'issue';
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  author: string;
  url: string;
  timestamp: Date;
  metadata: MetadataObject;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export const REGISTERED_PLUGINS = Symbol('REGISTERED_PLUGINS');

export interface GitLumenPlugin {}

export interface INotificationPlugin extends GitLumenPlugin {
  // Instance properties
  readonly id: string;
  readonly name: string;
  readonly type: string;

  // Methods
  validateConfig(config: JsonObject): boolean;
  testConnection(): Promise<boolean>;

  // Optional event handlers for provider development events
  onMergeRequestEvent?(event: MergeRequestDevelopmentEvent): Promise<void>;
  onPipelineEvent?(event: PipelineDevelopmentEvent): Promise<void>;
  onIssueEvent?(event: IssueDevelopmentEvent): Promise<void>;
  onPushEvent?(event: PushDevelopmentEvent): Promise<void>;
  onTagPushEvent?(event: TagPushDevelopmentEvent): Promise<void>;
  onNoteEvent?(event: NoteDevelopmentEvent): Promise<void>;
}

// For plugins that need static metadata (set via @Plugin decorator)
export interface PluginConstructor {
  new (config: PluginRuntimeConfig): INotificationPlugin;
  readonly pluginType: string;
  readonly pluginName: string;
  readonly pluginDescription?: string;
  readonly pluginVersion?: string;
  readonly pluginAuthor?: string;
}
