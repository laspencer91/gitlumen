import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { JsonObject } from '@gitlumen/core';
import {
  GitLabApiProject,
  GitLabApiIssue,
  GitLabApiMergeRequest,
  GitLabApiPipeline,
  GitLabApiHook,
} from './types';
import { GitLabUser } from './webhook-types';

export class GitLabApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;

    this.client = axios.create({
      baseURL: `${baseUrl}/api/v4`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('GitLab authentication failed. Please check your access token.');
        }
        if (error.response?.status === 403) {
          throw new Error('GitLab access forbidden. Please check your permissions.');
        }
        if (error.response?.status === 404) {
          throw new Error('GitLab resource not found.');
        }
        throw error;
      }
    );
  }

  async getCurrentUser(): Promise<GitLabUser> {
    const response = await this.client.get('/user');
    return response.data;
  }

  async getProject(projectId: string): Promise<GitLabApiProject> {
    const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}`);
    return response.data;
  }

  async listProjects(): Promise<GitLabApiProject[]> {
    const response = await this.client.get('/projects', {
      params: {
        membership: true,
        order_by: 'name',
        sort: 'asc',
        per_page: 100,
      },
    });
    return response.data;
  }

  async getMergeRequest(projectId: string, mergeRequestId: string): Promise<GitLabApiMergeRequest> {
    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestId}`
    );
    return response.data;
  }

  async listMergeRequests(projectId: string, state?: string): Promise<GitLabApiMergeRequest[]> {
    const params: JsonObject = {
      per_page: 100,
      order_by: 'created_at',
      sort: 'desc',
    };

    if (state) {
      params.state = state;
    }

    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/merge_requests`,
      { params }
    );
    return response.data;
  }

  async getPipeline(projectId: string, pipelineId: string): Promise<GitLabApiPipeline> {
    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/pipelines/${pipelineId}`
    );
    return response.data;
  }

  async listPipelines(projectId: string): Promise<GitLabApiPipeline[]> {
    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/pipelines`,
      {
        params: {
          per_page: 100,
          order_by: 'created_at',
          sort: 'desc',
        },
      }
    );
    return response.data;
  }

  async getIssue(projectId: string, issueId: string): Promise<GitLabApiIssue> {
    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/issues/${issueId}`
    );
    return response.data;
  }

  async listIssues(projectId: string, state?: string): Promise<GitLabApiIssue[]> {
    const params: JsonObject = {
      per_page: 100,
      order_by: 'created_at',
      sort: 'desc',
    };

    if (state) {
      params.state = state;
    }

    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/issues`,
      { params }
    );
    return response.data;
  }

  async getProjectHooks(projectId: string): Promise<GitLabApiHook[]> {
    const response = await this.client.get(
      `/projects/${encodeURIComponent(projectId)}/hooks`
    );
    return response.data;
  }

  async createProjectHook(projectId: string, hookData: JsonObject): Promise<GitLabApiHook> {
    const response = await this.client.post(
      `/projects/${encodeURIComponent(projectId)}/hooks`,
      hookData
    );
    return response.data;
  }

  async updateProjectHook(projectId: string, hookId: string, hookData: JsonObject): Promise<GitLabApiHook> {
    const response = await this.client.put(
      `/projects/${encodeURIComponent(projectId)}/hooks/${hookId}`,
      hookData
    );
    return response.data;
  }

  async deleteProjectHook(projectId: string, hookId: string): Promise<void> {
    await this.client.delete(
      `/projects/${encodeURIComponent(projectId)}/hooks/${hookId}`
    );
  }
}
