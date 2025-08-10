import { IProvider, ProviderRuntimeConfig, ProjectInfo } from '@gitlumen/core';
import { GitLabApiClient } from './api-client';
import { GitLabWebhookValidator } from './webhook-validator';
import { GitLabEventParser } from './event-parser';
import { GitLabWebhookEvents } from './webhook-types';
import { GitLabDevelopmentEvent } from './provider-event';
import { GitLabWebhookHeaders } from './types';

export class GitLabProvider implements IProvider<GitLabWebhookEvents, GitLabWebhookHeaders> {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;

  private config: ProviderRuntimeConfig;
  private apiClient: GitLabApiClient;
  private webhookValidator: GitLabWebhookValidator;
  private eventParser: GitLabEventParser;

  constructor(config: ProviderRuntimeConfig) {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;

    this.apiClient = new GitLabApiClient(config.baseUrl, config.accessToken);
    this.webhookValidator = new GitLabWebhookValidator(config.webhookSecret || '');
    this.eventParser = new GitLabEventParser();
  }

  validateWebhook(payload: GitLabWebhookEvents, headers: GitLabWebhookHeaders): boolean {
    return this.webhookValidator.validate(payload, headers as unknown as GitLabWebhookHeaders);
  }

  parseEvent(payload: GitLabWebhookEvents): GitLabDevelopmentEvent {
    return this.eventParser.parse(payload); // TODO: Validate payload structure
  }

  async getProjectInfo(projectId: string): Promise<ProjectInfo> {
    try {
      const project = await this.apiClient.getProject(projectId);

      return {
        id: project.id.toString(),
        name: project.name,
        description: project.description || undefined,
        webUrl: project.web_url,
        defaultBranch: project.default_branch,
        visibility: project.visibility as 'public' | 'private' | 'internal',
      };
    } catch (error) {
      throw new Error(`Failed to get project info for ${projectId}: ${error}`);
    }
  }

  async getMergeRequest(projectId: string, mergeRequestId: string): Promise<any> {
    return this.apiClient.getMergeRequest(projectId, mergeRequestId);
  }

  async getPipeline(projectId: string, pipelineId: string): Promise<any> {
    return this.apiClient.getPipeline(projectId, pipelineId);
  }

  async getIssue(projectId: string, issueId: string): Promise<any> {
    return this.apiClient.getIssue(projectId, issueId);
  }

  async listProjects(): Promise<any[]> {
    return this.apiClient.listProjects();
  }

  async listMergeRequests(projectId: string, state?: string): Promise<any[]> {
    return this.apiClient.listMergeRequests(projectId, state);
  }

  async listPipelines(projectId: string): Promise<any[]> {
    return this.apiClient.listPipelines(projectId);
  }

  async listIssues(projectId: string, state?: string): Promise<any[]> {
    return this.apiClient.listIssues(projectId, state);
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.apiClient.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
}
