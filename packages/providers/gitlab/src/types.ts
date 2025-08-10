/**
 * GitLab webhook payload types
 * These interfaces define the expected structure of GitLab webhook payloads
 */

export interface GitLabUser {
  id: number;
  name: string;
  username: string;
  email?: string;
  avatar_url?: string;
}

export interface GitLabProject {
  id: number;
  name: string;
  description?: string;
  web_url: string;
  namespace?: {
    name: string;
    path: string;
  };
}

export interface GitLabCommit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
  added: string[];
  modified: string[];
  removed: string[];
}

export interface GitLabLabel {
  id: number;
  title: string;
  name: string;
  color: string;
  description?: string;
}

export interface GitLabMilestone {
  id: number;
  title: string;
  description?: string;
  state: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  due_date?: string;
}

// Merge Request specific types
export interface GitLabMergeRequestAttributes {
  id: number;
  iid: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  target_branch: string;
  source_branch: string;
  source_project_id: number;
  target_project_id: number;
  url: string;
  merge_status: 'can_be_merged' | 'cannot_be_merged' | 'unchecked';
  action?: 'open' | 'close' | 'reopen' | 'update' | 'approved' | 'unapproved' | 'approval' | 'unapproval' | 'merge';
}

export interface GitLabMergeRequestPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: GitLabMergeRequestAttributes;
  labels?: GitLabLabel[];
  assignees?: GitLabUser[];
  reviewers?: GitLabUser[];
  milestone?: GitLabMilestone;
}

// Pipeline specific types
export interface GitLabPipelineAttributes {
  id: number;
  ref: string;
  tag: boolean;
  sha: string;
  before_sha: string;
  source: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped';
  stages: string[];
  created_at: string;
  finished_at?: string;
  duration?: number;
  variables?: Array<{
    key: string;
    value: string;
  }>;
}

export interface GitLabBuild {
  id: number;
  stage: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped';
  created_at: string;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  allow_failure: boolean;
}

export interface GitLabPipelinePayload {
  object_kind: 'pipeline';
  object_attributes: GitLabPipelineAttributes;
  merge_request?: {
    id: number;
    iid: number;
    title: string;
    source_branch: string;
    target_branch: string;
    state: string;
    url: string;
  };
  user: GitLabUser;
  project: GitLabProject;
  commit: {
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
  };
  builds?: GitLabBuild[];
}

// Issue specific types
export interface GitLabIssueAttributes {
  id: number;
  iid: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  url: string;
  action?: 'open' | 'close' | 'reopen' | 'update';
}

export interface GitLabIssuePayload {
  object_kind: 'issue';
  event_type: 'issue';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: GitLabIssueAttributes;
  labels?: GitLabLabel[];
  assignees?: GitLabUser[];
  milestone?: GitLabMilestone;
}

// Push specific types
export interface GitLabPushPayload {
  object_kind: 'push';
  event_name: 'push';
  before: string;
  after: string;
  ref: string;
  checkout_sha: string;
  message?: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar?: string;
  project_id: number;
  project: GitLabProject;
  commits: GitLabCommit[];
  total_commits_count: number;
}

// Tag push specific types
export interface GitLabTagPushPayload {
  object_kind: 'tag_push';
  event_name: 'tag_push';
  before: string;
  after: string;
  ref: string;
  checkout_sha: string;
  message?: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar?: string;
  project_id: number;
  project: GitLabProject;
  commits: GitLabCommit[];
  total_commits_count: number;
}

// Note (comment) specific types
export interface GitLabNoteAttributes {
  id: number;
  note: string;
  noteable_type: 'Issue' | 'MergeRequest' | 'Commit' | 'Snippet';
  noteable_id: number;
  author_id: number;
  created_at: string;
  updated_at: string;
  project_id: number;
  attachment?: string;
  line_code?: string;
  commit_id?: string;
  system: boolean;
  url: string;
}

export interface GitLabNotePayload {
  object_kind: 'note';
  event_type: 'note';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: GitLabNoteAttributes;
  merge_request?: GitLabMergeRequestAttributes;
  issue?: GitLabIssueAttributes;
  commit?: {
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
  };
}

// Union type for all possible GitLab webhook payloads
export type GitLabWebhookPayload = 
  | GitLabMergeRequestPayload
  | GitLabPipelinePayload
  | GitLabIssuePayload
  | GitLabPushPayload
  | GitLabTagPushPayload
  | GitLabNotePayload;

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