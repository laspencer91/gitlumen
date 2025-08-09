import { Plugin, PluginRuntimeConfig, NotificationEvent, NotificationResult } from '@gitlumen/core';
import { TeamsClient } from './teams-client';
import { MessageFormatter } from './message-formatter';

export interface TeamsPluginConfig {
  webhookUrl: string;
  botName: string;
  botAvatar?: string;
  defaultChannel?: string;
  enableMentions?: boolean;
  mentionUsers?: string[];
  colorScheme?: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export class TeamsPlugin implements Plugin {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;

  private config: TeamsPluginConfig;
  private client: TeamsClient;
  private formatter: MessageFormatter;

  constructor(config: PluginRuntimeConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.config = config.config as TeamsPluginConfig;

    this.client = new TeamsClient(this.config.webhookUrl);
    this.formatter = new MessageFormatter(this.config);
  }

  async sendNotification(event: NotificationEvent): Promise<NotificationResult> {
    try {
      const message = this.formatter.formatMessage(event);
      const result = await this.client.sendMessage(message);

      return {
        success: true,
        messageId: result.id || `teams_${Date.now()}`,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  validateConfig(config: any): boolean {
    if (!config.webhookUrl || !config.botName) {
      return false;
    }

    try {
      new URL(config.webhookUrl);
      return true;
    } catch {
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testMessage = {
        text: 'GitLumen Teams plugin connection test successful!',
        title: 'Connection Test',
        themeColor: '#0078D4',
      };

      await this.client.sendMessage(testMessage);
      return true;
    } catch {
      return false;
    }
  }

  getConfig(): TeamsPluginConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<TeamsPluginConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.formatter = new MessageFormatter(this.config);
  }
} 