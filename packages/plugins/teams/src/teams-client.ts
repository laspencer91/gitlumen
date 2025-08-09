import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface TeamsMessage {
  text?: string;
  title?: string;
  summary?: string;
  themeColor?: string;
  sections?: TeamsSection[];
  potentialAction?: TeamsAction[];
}

export interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  activityText?: string;
  activityImage?: string;
  facts?: TeamsFact[];
  text?: string;
  markdown?: boolean;
}

export interface TeamsFact {
  name: string;
  value: string;
}

export interface TeamsAction {
  '@type': string;
  name: string;
  targets: TeamsTarget[];
}

export interface TeamsTarget {
  os: string;
  uri: string;
}

export interface TeamsResponse {
  id?: string;
  status?: string;
  message?: string;
}

export class TeamsClient {
  private client: AxiosInstance;
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;

    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 429) {
          throw new Error('Teams rate limit exceeded. Please try again later.');
        }
        if (error.response?.status >= 500) {
          throw new Error('Teams service temporarily unavailable.');
        }
        throw error;
      }
    );
  }

  async sendMessage(message: TeamsMessage): Promise<TeamsResponse> {
    try {
      const response = await this.client.post(this.webhookUrl, message);
      
      // Teams webhooks don't return a response body, so we create a mock response
      return {
        id: `teams_${Date.now()}`,
        status: 'success',
        message: 'Message sent successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send Teams message: ${error.message}`);
      }
      throw new Error('Failed to send Teams message: Unknown error');
    }
  }

  async sendSimpleMessage(text: string, title?: string, color?: string): Promise<TeamsResponse> {
    const message: TeamsMessage = {
      text,
      title,
      themeColor: color || '#0078D4',
    };

    return this.sendMessage(message);
  }

  async sendCardMessage(
    title: string,
    text: string,
    facts: TeamsFact[] = [],
    actions: TeamsAction[] = [],
    color: string = '#0078D4'
  ): Promise<TeamsResponse> {
    const message: TeamsMessage = {
      title,
      text,
      themeColor: color,
      sections: [
        {
          facts,
          markdown: true,
        },
      ],
      potentialAction: actions,
    };

    return this.sendMessage(message);
  }

  async sendActivityMessage(
    activityTitle: string,
    activitySubtitle: string,
    activityText: string,
    facts: TeamsFact[] = [],
    color: string = '#0078D4'
  ): Promise<TeamsResponse> {
    const message: TeamsMessage = {
      themeColor: color,
      sections: [
        {
          activityTitle,
          activitySubtitle,
          activityText,
          facts,
          markdown: true,
        },
      ],
    };

    return this.sendMessage(message);
  }

  // Helper method to create fact objects
  createFact(name: string, value: string): TeamsFact {
    return { name, value };
  }

  // Helper method to create action objects
  createAction(name: string, uri: string): TeamsAction {
    return {
      '@type': 'OpenUri',
      name,
      targets: [
        {
          os: 'default',
          uri,
        },
      ],
    };
  }

  // Test webhook connectivity
  async testWebhook(): Promise<boolean> {
    try {
      const testMessage: TeamsMessage = {
        text: 'GitLumen Teams plugin webhook test',
        title: 'Webhook Test',
        themeColor: '#0078D4',
      };

      await this.sendMessage(testMessage);
      return true;
    } catch {
      return false;
    }
  }
} 