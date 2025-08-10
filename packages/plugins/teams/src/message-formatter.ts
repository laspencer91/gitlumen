import { NotificationEvent } from '@gitlumen/core';
import { TeamsMessage, TeamsFact, TeamsAction } from './teams-client';

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

export class MessageFormatter {
  private config: TeamsPluginConfig;

  constructor(config: TeamsPluginConfig) {
    this.config = config;
  }

  formatMessage(event: NotificationEvent): TeamsMessage {
    const color = this.getEventColor(event.type);
    const title = this.formatTitle(event);
    const text = this.formatText(event);
    const facts = this.formatFacts(event);
    const actions = this.formatActions(event);

    return {
      title,
      text,
      themeColor: color,
      sections: [
        {
          activityTitle: event.title,
          activitySubtitle: `${event.projectName} • ${event.author}`,
          activityText: event.description || '',
          facts,
          markdown: true,
        },
      ],
      potentialAction: actions,
    };
  }

  private getEventColor(eventType: string): string {
    const colorScheme = this.config.colorScheme || {
      success: '#107C10',
      warning: '#FF8C00',
      error: '#D13438',
      info: '#0078D4',
    };

    switch (eventType) {
      case 'merge_request':
        return colorScheme.info;
      case 'pipeline':
        return colorScheme.info;
      case 'deployment':
        return colorScheme.success;
      case 'issue':
        return colorScheme.warning;
      default:
        return colorScheme.info;
    }
  }

  private formatTitle(event: NotificationEvent): string {
    const emoji = this.getEventEmoji(event.type);
    return `${emoji} ${event.title}`;
  }

  private formatText(event: NotificationEvent): string {
    let text = '';

    if (this.config.enableMentions && this.config.mentionUsers?.length) {
      const mentions = this.config.mentionUsers
        .map(user => `@${user}`)
        .join(' ');
      text += `${mentions}\n\n`;
    }

    text += `**Project:** ${event.projectName}\n`;
    text += `**Author:** ${event.author}\n`;

    if (event.description) {
      text += `**Description:** ${event.description}\n`;
    }

    text += `**Time:** ${event.timestamp.toLocaleString()}`;

    return text;
  }

  private formatFacts(event: NotificationEvent): TeamsFact[] {
    const facts: TeamsFact[] = [
      { name: 'Project', value: event.projectName },
      { name: 'Author', value: event.author },
      { name: 'Type', value: this.formatEventType(event.type) },
      { name: 'Timestamp', value: event.timestamp.toLocaleString() },
    ];

    // Add event-specific facts
    if (event.metadata) {
      Object.entries(event.metadata).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value !== 'N/A') {
          facts.push({ name: this.formatFactName(key), value: String(value) });
        }
      });
    }

    return facts;
  }

  private formatActions(event: NotificationEvent): TeamsAction[] {
    const actions: TeamsAction[] = [];

    // Add view action
    if (event.url) {
      actions.push({
        '@type': 'OpenUri',
        name: 'View Details',
        targets: [
          {
            os: 'default',
            uri: event.url,
          },
        ],
      });
    }

    // Add project action
    if (event.projectName) {
      actions.push({
        '@type': 'OpenUri',
        name: 'View Project',
        targets: [
          {
            os: 'default',
            uri: event.url?.split('/-/')[0] || '#',
          },
        ],
      });
    }

    return actions;
  }

  private getEventEmoji(eventType: string): string {
    switch (eventType) {
      case 'merge_request':
        return '🔀';
      case 'pipeline':
        return '⚡';
      case 'deployment':
        return '🚀';
      case 'issue':
        return '🐛';
      case 'push':
        return '📝';
      case 'tag_push':
        return '🏷️';
      case 'note':
        return '💬';
      default:
        return '📢';
    }
  }

  private formatEventType(eventType: string): string {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatFactName(key: string): string {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Format specific event types with custom logic
  formatMergeRequestMessage(event: NotificationEvent): TeamsMessage {
    const color = this.getEventColor('merge_request');
    const title = `🔀 ${event.title}`;

    const facts: TeamsFact[] = [
      { name: 'Project', value: event.projectName },
      { name: 'Author', value: event.author },
      { name: 'Source Branch', value: (event.metadata?.sourceBranch as string) || 'N/A' },
      { name: 'Target Branch', value: (event.metadata?.targetBranch as string) || 'N/A' },
      { name: 'State', value: (event.metadata?.state as string) || 'N/A' },
      { name: 'Merge Status', value: (event.metadata?.mergeStatus as string) || 'N/A' },
    ];

    if (Array.isArray(event.metadata?.labels) && event.metadata.labels.length > 0) {
      facts.push({ name: 'Labels', value: (event.metadata.labels as string[]).join(', ') });
    }

    return {
      title,
      text: event.description || '',
      themeColor: color,
      sections: [
        {
          activityTitle: event.title,
          activitySubtitle: `${event.projectName} • ${event.author}`,
          facts,
          markdown: true,
        },
      ],
      potentialAction: this.formatActions(event),
    };
  }

  formatPipelineMessage(event: NotificationEvent): TeamsMessage {
    const color = this.getEventColor('pipeline');
    const title = `⚡ ${event.title}`;

    const facts: TeamsFact[] = [
      { name: 'Project', value: event.projectName },
      { name: 'Author', value: event.author },
      { name: 'Branch', value: (event.metadata?.ref as string) || 'N/A' },
      { name: 'Status', value: (event.metadata?.status as string) || 'N/A' },
      { name: 'Commit SHA', value: (event.metadata?.sha as string)?.substring(0, 8) || 'N/A' },
    ];

    if (typeof event.metadata?.duration === 'number') {
      facts.push({ name: 'Duration', value: `${event.metadata.duration}s` });
    }

    if (Array.isArray(event.metadata?.stages) && event.metadata.stages.length > 0) {
      const stageInfo = (event.metadata.stages as Array<{ name: string; status: string }>)
        .map((stage: { name: string; status: string }) => `${stage.name}: ${stage.status}`)
        .join(', ');
      facts.push({ name: 'Stages', value: stageInfo });
    }

    return {
      title,
      text: event.description || '',
      themeColor: color,
      sections: [
        {
          activityTitle: event.title,
          activitySubtitle: `${event.projectName} • ${event.author}`,
          facts,
          markdown: true,
        },
      ],
      potentialAction: this.formatActions(event),
    };
  }
}
