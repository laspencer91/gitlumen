import { MetadataObject } from './common.types';

export enum EventType {
  MERGE_REQUEST_OPENED = 'merge_request_opened',
  MERGE_REQUEST_MERGED = 'merge_request_merged',
  MERGE_REQUEST_CLOSED = 'merge_request_closed',
  PIPELINE_SUCCESS = 'pipeline_success',
  PIPELINE_FAILED = 'pipeline_failed',
  DEPLOYMENT_SUCCESS = 'deployment_success',
  DEPLOYMENT_FAILED = 'deployment_failed',
  ISSUE_OPENED = 'issue_opened',
  ISSUE_CLOSED = 'issue_closed',
}

export interface BaseEvent {
  id: string;
  type: EventType;
  projectId: string;
  timestamp: Date;
  metadata: MetadataObject;
}

export interface MergeRequestEvent extends BaseEvent {
  type: EventType.MERGE_REQUEST_OPENED | EventType.MERGE_REQUEST_MERGED | EventType.MERGE_REQUEST_CLOSED;
  mergeRequestId: string;
  title: string;
  description?: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  url: string;
  state: 'opened' | 'merged' | 'closed';
}

export interface PipelineEvent extends BaseEvent {
  type: EventType.PIPELINE_SUCCESS | EventType.PIPELINE_FAILED;
  pipelineId: string;
  branch: string;
  commitSha: string;
  duration?: number;
  stages: PipelineStage[];
}

export interface PipelineStage {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled';
  duration?: number;
}

export interface DeploymentEvent extends BaseEvent {
  type: EventType.DEPLOYMENT_SUCCESS | EventType.DEPLOYMENT_FAILED;
  deploymentId: string;
  environment: string;
  branch: string;
  commitSha: string;
  duration?: number;
}

export interface IssueEvent extends BaseEvent {
  type: EventType.ISSUE_OPENED | EventType.ISSUE_CLOSED;
  issueId: string;
  title: string;
  description?: string;
  author: string;
  assignee?: string;
  labels: string[];
  state: 'opened' | 'closed';
} 