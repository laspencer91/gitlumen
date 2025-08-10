/**
 * Strongly-typed metadata interfaces for GitLab events
 * These provide type safety for the metadata field in ProviderEvent
 */

import { BaseDevelopmentEventMetadata } from '@gitlumen/core';

/**
 * Base interface for GitLab event metadata
 * Extends the core BaseDevelopmentEventMetadata for GitLab-specific events
 */
interface BaseEventMetadata extends BaseDevelopmentEventMetadata {
  // GitLab-specific base properties can be added here if needed
}

/**
 * Merge Request event metadata
 */
export interface MergeRequestMetadata extends BaseEventMetadata {
  mergeRequestId: number;
  mergeRequestIid: number;
  sourceBranch: string;
  targetBranch: string;
  state: string;
  action: string;
  mergeStatus: string;
  workInProgress: boolean;
  assignees: string[];
  reviewers?: string[];
  labels: string[];
  milestoneId?: number;
  isApproved?: boolean;
  hasConflicts?: boolean;
  blockingDiscussionsResolved?: boolean;
}

/**
 * Pipeline event metadata
 */
export interface PipelineMetadata extends BaseEventMetadata {
  pipelineId: number;
  pipelineIid?: number;
  status: string;
  ref: string;
  sha: string;
  beforeSha: string;
  source: string;
  tag: boolean;
  duration?: number;
  queuedDuration?: number;
  createdAt: string;
  finishedAt?: string;
  stages: Array<{
    name: string;
    status: string;
    allowFailure: boolean;
  }>;
  mergeRequest?: {
    id: number;
    iid: number;
    title: string;
    sourceBranch: string;
    targetBranch: string;
    state: string;
    mergeStatus: string;
  };
}

/**
 * Issue event metadata
 */
export interface IssueMetadata extends BaseEventMetadata {
  issueId: number;
  issueIid: number;
  state: string;
  action: string;
  confidential: boolean;
  labels: string[];
  assignees: string[];
  milestoneId?: number;
  dueDate?: string;
  timeEstimate: number;
  totalTimeSpent: number;
  weight?: number;
  healthStatus?: string;
  severity?: string;
}

/**
 * Push event metadata
 */
export interface PushMetadata extends BaseEventMetadata {
  ref: string;
  before: string;
  after: string;
  checkoutSha: string;
  refProtected: boolean;
  totalCommitsCount: number;
  commits: Array<{
    id: string;
    message: string;
    title?: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
    added?: string[];
    modified?: string[];
    removed?: string[];
  }>;
}

/**
 * Tag push event metadata
 */
export interface TagPushMetadata extends BaseEventMetadata {
  ref: string;
  before: string;
  after: string;
  checkoutSha: string;
  tag: string;
  totalCommitsCount: number;
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
  }>;
}

/**
 * Note (comment) event metadata
 */
export interface NoteMetadata extends BaseEventMetadata {
  noteId: number;
  noteableType: 'Issue' | 'MergeRequest' | 'Commit' | 'Snippet';
  noteableId?: number;
  note: string;
  system: boolean;
  lineCode?: string;
  commitId?: string;
  discussionId?: string;
  resolved?: boolean;
  resolvedAt?: string;
  resolvedById?: number;
  mergeRequest?: {
    id: number;
    iid: number;
    title: string;
    state: string;
    sourceBranch: string;
    targetBranch: string;
  };
  issue?: {
    id: number;
    iid: number;
    title: string;
    state: string;
  };
}

/**
 * Job (Build) event metadata
 */
export interface JobMetadata extends BaseEventMetadata {
  buildId: number;
  buildName: string;
  buildStage: string;
  buildStatus: string;
  buildCreatedAt: string;
  buildStartedAt?: string;
  buildFinishedAt?: string;
  buildDuration?: number;
  buildQueuedDuration?: number;
  buildAllowFailure: boolean;
  buildFailureReason?: string;
  pipelineId: number;
  runner?: {
    id: number;
    description: string;
    active: boolean;
    isShared: boolean;
    tags?: string[];
  };
  environment?: {
    name: string;
    action: string;
    deploymentTier: string;
  };
}

/**
 * Wiki page event metadata
 */
export interface WikiPageMetadata extends BaseEventMetadata {
  title: string;
  content: string;
  format: 'markdown' | 'rdoc' | 'asciidoc' | 'org';
  message?: string;
  slug: string;
  action: 'create' | 'update' | 'delete';
}

/**
 * Deployment event metadata
 */
export interface DeploymentMetadata extends BaseEventMetadata {
  deploymentId: number;
  deployableId: number;
  deployableUrl: string;
  environment: string;
  status: string;
  statusChangedAt: string;
  shortSha: string;
  commitUrl: string;
  commitTitle: string;
}

/**
 * Release event metadata
 */
export interface ReleaseMetadata extends BaseEventMetadata {
  releaseId: number;
  name: string;
  tag: string;
  description?: string;
  createdAt: string;
  releasedAt?: string;
  upcomingRelease?: boolean;
  action: 'create' | 'update' | 'delete';
  assets: {
    count: number;
    links: Array<{
      id: number;
      external: boolean;
      linkType: string;
      name: string;
      url: string;
    }>;
    sources: Array<{
      format: string;
      url: string;
    }>;
  };
}

/**
 * Union type for all GitLab event metadata
 */
export type GitLabEventMetadata =
  | MergeRequestMetadata
  | PipelineMetadata
  | IssueMetadata
  | PushMetadata
  | TagPushMetadata
  | NoteMetadata
  | JobMetadata
  | WikiPageMetadata
  | DeploymentMetadata
  | ReleaseMetadata;

/**
 * Generic metadata for unknown/unsupported events
 */
export interface GenericEventMetadata extends BaseEventMetadata {
  eventType: string;
  objectKind: string;
  rawData: Record<string, any>;
}

/**
 * Complete metadata type including generic fallback
 */
export type EventMetadata = GitLabEventMetadata | GenericEventMetadata;
