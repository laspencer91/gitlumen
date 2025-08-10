/**
 * GitLab webhook payload types
 * These interfaces define the expected structure of GitLab webhook payloads
 *
 * Note: The comprehensive webhook event types are now in webhook-types.ts
 * This file maintains the header types and legacy compatibility
 */

import { GitLabMilestone, GitLabUser } from './webhook-types';

/**
 * GitLab webhook event types as sent in X-Gitlab-Event header
 * Based on: https://docs.gitlab.com/user/project/integrations/webhook_events/
 */
export type GitLabEventType =
  | 'Push Hook'
  | 'Tag Push Hook'
  | 'Issue Hook'
  | 'Confidential Issue Hook'
  | 'Note Hook'
  | 'Confidential Note Hook'
  | 'Merge Request Hook'
  | 'Wiki Page Hook'
  | 'Pipeline Hook'
  | 'Job Hook'
  | 'Deployment Hook'
  | 'Feature Flag Hook'
  | 'Release Hook'
  | 'Milestone Hook'
  | 'Emoji Hook'
  | 'Resource Access Token Hook'
  | 'Vulnerability Hook'
  | 'Group Member Hook'
  | 'Project Hook'
  | 'Subgroup Hook'
  | 'Work Item Hook';

/**
 * GitLab webhook headers interface
 */
export interface GitLabWebhookHeaders {
  'x-gitlab-event': GitLabEventType;
  'x-gitlab-token'?: string;
  'x-request-id'?: string;
  'x-gitlab-instance'?: string;
  'user-agent'?: string;
  'content-type'?: string;
}

// ============================================================================
// NOTE: This file now only contains header types and GitLab API types
// All comprehensive webhook event types have been moved to webhook-types.ts
// ============================================================================

// GitLab API Response Types
// These represent the structure of data returned by GitLab's REST API

export interface GitLabApiProject {
  id: number;
  name: string;
  description: string | null;
  web_url: string;
  avatar_url: string | null;
  git_ssh_url: string;
  git_http_url: string;
  namespace: {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id: number | null;
    avatar_url: string | null;
    web_url: string;
  };
  path: string;
  path_with_namespace: string;
  default_branch: string;
  tag_list: string[];
  topics: string[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  readme_url: string | null;
  forks_count: number;
  star_count: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  visibility: 'private' | 'internal' | 'public';
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  container_registry_enabled: boolean;
  service_desk_enabled: boolean;
  can_create_merge_request_in: boolean;
  issues_access_level: 'disabled' | 'private' | 'enabled';
  repository_access_level: 'disabled' | 'private' | 'enabled';
  merge_requests_access_level: 'disabled' | 'private' | 'enabled';
  forking_access_level: 'disabled' | 'private' | 'enabled';
  wiki_access_level: 'disabled' | 'private' | 'enabled';
  builds_access_level: 'disabled' | 'private' | 'enabled';
  snippets_access_level: 'disabled' | 'private' | 'enabled';
  pages_access_level: 'disabled' | 'private' | 'enabled';
  analytics_access_level: 'disabled' | 'private' | 'enabled';
  container_registry_access_level: 'disabled' | 'private' | 'enabled';
  security_and_compliance_access_level: 'disabled' | 'private' | 'enabled';
  releases_access_level: 'disabled' | 'private' | 'enabled';
  environments_access_level: 'disabled' | 'private' | 'enabled';
  feature_flags_access_level: 'disabled' | 'private' | 'enabled';
  infrastructure_access_level: 'disabled' | 'private' | 'enabled';
  monitor_access_level: 'disabled' | 'private' | 'enabled';
  model_experiments_access_level: 'disabled' | 'private' | 'enabled';
  model_registry_access_level: 'disabled' | 'private' | 'enabled';
}

export interface GitLabApiIssue {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string | null;
  state: 'opened' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  closed_by: GitLabUser | null;
  labels: string[];
  milestone: GitLabMilestone | null;
  assignees: GitLabUser[];
  author: GitLabUser;
  type: 'issue' | 'incident' | 'test_case' | 'requirement' | 'task';
  assignee: GitLabUser | null;
  user_notes_count: number;
  merge_requests_count: number;
  upvotes: number;
  downvotes: number;
  due_date: string | null;
  confidential: boolean;
  discussion_locked: boolean | null;
  issue_type: 'issue' | 'incident' | 'test_case' | 'requirement' | 'task';
  web_url: string;
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: string | null;
    human_total_time_spent: string | null;
  };
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  blocking_issues_count: number;
  has_tasks: boolean;
  task_status: string;
  _links: {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
    closed_as_duplicate_of: string | null;
  };
  references: {
    short: string;
    relative: string;
    full: string;
  };
  severity: 'unknown' | 'low' | 'medium' | 'high' | 'critical';
  subscribed: boolean;
  moved_to_id: number | null;
  epic_issue_id: number | null;
  epic: {
    id: number;
    title: string;
    url: string;
    group_id: number;
  } | null;
}

export interface GitLabApiMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string | null;
  state: 'opened' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  merged_by: GitLabUser | null;
  merge_user: GitLabUser | null;
  merged_at: string | null;
  closed_by: GitLabUser | null;
  closed_at: string | null;
  target_branch: string;
  source_branch: string;
  user_notes_count: number;
  upvotes: number;
  downvotes: number;
  author: GitLabUser;
  assignees: GitLabUser[];
  assignee: GitLabUser | null;
  reviewers: GitLabUser[];
  source_project_id: number;
  target_project_id: number;
  labels: string[];
  draft: boolean;
  work_in_progress: boolean;
  milestone: GitLabMilestone | null;
  merge_when_pipeline_succeeds: boolean;
  merge_status: 'can_be_merged' | 'cannot_be_merged' | 'unchecked';
  detailed_merge_status: string;
  sha: string;
  merge_commit_sha: string | null;
  squash_commit_sha: string | null;
  discussion_locked: boolean | null;
  should_remove_source_branch: boolean | null;
  force_remove_source_branch: boolean;
  reference: string;
  references: {
    short: string;
    relative: string;
    full: string;
  };
  web_url: string;
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: string | null;
    human_total_time_spent: string | null;
  };
  squash: boolean;
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  has_conflicts: boolean;
  blocking_discussions_resolved: boolean;
  approvals_before_merge: number | null;
}

export interface GitLabApiPipeline {
  id: number;
  iid: number;
  project_id: number;
  status: 'created' | 'waiting_for_resource' | 'preparing' | 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual' | 'scheduled';
  source: string;
  ref: string;
  sha: string;
  before_sha: string;
  tag: boolean;
  yaml_errors: string | null;
  user: GitLabUser;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
  committed_at: string | null;
  duration: number | null;
  queued_duration: number | null;
  coverage: string | null;
  web_url: string;
  detailed_status: {
    icon: string;
    text: string;
    label: string;
    group: string;
    tooltip: string;
    has_details: boolean;
    details_path: string;
    illustration: any | null;
    favicon: string;
  };
}

export interface GitLabApiHook {
  id: number;
  url: string;
  project_id: number;
  push_events: boolean;
  push_events_branch_filter: string;
  issues_events: boolean;
  confidential_issues_events: boolean;
  merge_requests_events: boolean;
  tag_push_events: boolean;
  note_events: boolean;
  confidential_note_events: boolean;
  job_events: boolean;
  pipeline_events: boolean;
  wiki_page_events: boolean;
  deployment_events: boolean;
  releases_events: boolean;
  subgroup_events: boolean;
  member_events: boolean;
  push_events_branch_filter_strategy: string;
  enable_ssl_verification: boolean;
  created_at: string;
  updated_at: string;
  alert_status: string;
  disabled_until: string | null;
  url_variables: Array<{
    key: string;
  }>;
  resource_access_token_events: boolean;
  custom_webhook_template: string;
}

export interface GitLabApiPagination {
  per_page: number;
  page: number;
  total: number;
  total_pages: number;
}

// Common API response wrapper for paginated results
export interface GitLabApiListResponse<T> {
  data: T[];
  pagination?: GitLabApiPagination;
}
