import { ConfigObject, MetadataObject, JsonObject } from '../types';

export interface PluginRuntimeConfig {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  config: ConfigObject;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plugin {
  id: string;
  name: string;
  type: string;
  sendNotification(event: NotificationEvent): Promise<NotificationResult>;
  validateConfig(config: JsonObject): boolean;
}

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
