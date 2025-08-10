import {
  Plugin,
  PluginRuntimeConfig,
  NotificationResult,
  JsonObject,
  INotificationPlugin,
  MergeRequestDevelopmentEvent,
} from '@gitlumen/core';

export interface ConsolePluginConfig {
  logLevel?: 'basic' | 'detailed' | 'full';
  includeTimestamp?: boolean;
  includeMetadata?: boolean;
  colorOutput?: boolean;
  prefix?: string;
}

@Plugin({
  type: 'console',
  name: 'Console Logger',
  description: 'Console logging plugin for debugging',
  version: '1.0.0',
  author: 'GitLumen Team',
})
export class ConsolePlugin implements INotificationPlugin {
  public readonly id: string;
  public readonly name: string;
  public readonly type = 'console';

  private config: ConsolePluginConfig;

  // ANSI color codes for console output
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };

  private defaultConfig: ConsolePluginConfig = {
    logLevel: 'detailed',
    includeTimestamp: true,
    includeMetadata: true,
    colorOutput: true,
    prefix: '🔔 GitLumen',
  };

  constructor(runtimeConfig: PluginRuntimeConfig) {
    this.id = runtimeConfig.id;
    this.name = runtimeConfig.name;
    this.config = { ...this.defaultConfig, ...runtimeConfig.config };
  }

  async testConnection() {
    return true;
  }

  async onMergeRequestEvent(event: MergeRequestDevelopmentEvent): Promise<void> {
    await this.sendNotification(event);
  }

  async sendNotification(
    event: MergeRequestDevelopmentEvent
  ): Promise<NotificationResult> {
    try {
      this.logEvent(event);

      return {
        success: true,
        messageId: `console_${Date.now()}`,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  validateConfig(config: JsonObject): boolean {
    // Console plugin accepts any config
    console.log(config.toString().substring(0, 30) + '... validated');
    return true;
  }

  private logEvent(event: MergeRequestDevelopmentEvent): void {
    const timestamp = this.config.includeTimestamp
      ? `[${new Date().toISOString()}] `
      : '';

    const prefix = this.config.prefix ? `${this.config.prefix} ` : '';

    switch (this.config.logLevel) {
      case 'basic':
        this.logBasic(event, timestamp, prefix);
        break;
      case 'detailed':
        this.logDetailed(event, timestamp, prefix);
        break;
      case 'full':
        this.logFull(event, timestamp, prefix);
        break;
    }
  }

  private logBasic(
    event: MergeRequestDevelopmentEvent,
    timestamp: string,
    prefix: string
  ): void {
    const eventIcon = this.getEventIcon(event.type);
    const message = `${timestamp}${prefix}${eventIcon} ${event.type} in ${event.projectName}`;

    if (this.config.colorOutput) {
      console.log(this.colorize(message, this.getEventColor(event.type)));
    } else {
      console.log(message);
    }
  }

  private logDetailed(
    event: MergeRequestDevelopmentEvent,
    timestamp: string,
    prefix: string
  ): void {
    const eventIcon = this.getEventIcon(event.type);
    const eventColor = this.getEventColor(event.type);

    console.log(this.colorize('━'.repeat(80), 'dim'));
    console.log(
      this.colorize(
        `${timestamp}${prefix}${eventIcon} ${event.type.toUpperCase()} EVENT`,
        eventColor
      )
    );
    console.log(this.colorize('━'.repeat(80), 'dim'));

    // Project info
    console.log(this.colorize('📁 Project:', 'cyan'), event.projectName);
    console.log(this.colorize('🔗 URL:', 'cyan'), event.url);

    // User info
    console.log(this.colorize('👤 Author:', 'cyan'), event.author);

    // Event details
    console.log(this.colorize('📋 Title:', 'cyan'), event.title);
    if (event.description) {
      const truncatedDesc =
        event.description.length > 100
          ? event.description.substring(0, 100) + '...'
          : event.description;
      console.log(this.colorize('📝 Description:', 'cyan'), truncatedDesc);
    }

    // Event-specific details
    this.logEventSpecificDetails(event);

    if (this.config.includeMetadata) {
      console.log(
        this.colorize('⏰ Timestamp:', 'cyan'),
        event.timestamp || new Date().toISOString()
      );
      console.log(
        this.colorize('🔧 Plugin:', 'cyan'),
        `${this.name} (${this.id})`
      );
    }

    console.log(this.colorize('━'.repeat(80), 'dim'));
    console.log(); // Empty line for readability
  }

  private logFull(
    event: MergeRequestDevelopmentEvent,
    timestamp: string,
    prefix: string
  ): void {
    const eventIcon = this.getEventIcon(event.type);
    const eventColor = this.getEventColor(event.type);

    console.log(this.colorize('═'.repeat(80), 'bright'));
    console.log(
      this.colorize(
        `${timestamp}${prefix}${eventIcon} FULL ${event.type.toUpperCase()} EVENT PAYLOAD`,
        eventColor
      )
    );
    console.log(this.colorize('═'.repeat(80), 'bright'));

    console.log(this.colorize('Raw Event Data:', 'yellow'));
    console.log(JSON.stringify(event, null, 2));

    console.log(this.colorize('═'.repeat(80), 'bright'));
    console.log(); // Empty line for readability
  }

  private logEventSpecificDetails(event: MergeRequestDevelopmentEvent): void {
    // Log metadata if available
    if (event.metadata && Object.keys(event.metadata).length > 0) {
      console.log(this.colorize('📊 Metadata:', 'cyan'));
      Object.entries(event.metadata).forEach(([key, value]) => {
        console.log(this.colorize(`   ${key}:`, 'dim'), value);
      });
    }
  }

  private getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      merge_request: '🔀',
      pipeline: '🔄',
      deployment: '🚚',
      issue: '🐛',
    };
    return icons[eventType] || '📢';
  }

  private getEventColor(eventType: string): keyof typeof this.colors {
    const colors: Record<string, keyof typeof this.colors> = {
      merge_request: 'blue',
      pipeline: 'magenta',
      deployment: 'cyan',
      issue: 'yellow',
    };
    return colors[eventType] || 'white';
  }

  private colorize(text: string, color: keyof typeof this.colors): string {
    if (!this.config.colorOutput) {
      return text;
    }
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }
}
