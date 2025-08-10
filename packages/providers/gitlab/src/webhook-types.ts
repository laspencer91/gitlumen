/**
 * Comprehensive GitLab Webhook Types
 *
 * Based on:
 * - Official GitLab Documentation: https://docs.gitlab.com/user/project/integrations/webhook_events/
 * - gitlab-event-types library (enhanced and completed)
 *
 * This file provides complete, up-to-date TypeScript definitions for all GitLab webhook events.
 */

import { LiteralUnion } from './utils';

// ============================================================================
// COMMON TYPES (Enhanced from gitlab-event-types)
// ============================================================================

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
  avatar_url?: string;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path?: string;
  homepage?: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

export interface GitLabRepository {
  name: string;
  url: string;
  description?: string;
  homepage?: string;
}

export interface GitLabCommit {
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
  group_id?: number;
  project_id?: number;
  web_url: string;
}

export interface GitLabGroup {
  id: number;
  name: string;
  path: string;
  description?: string;
  visibility: string;
  lfs_enabled?: boolean;
  avatar_url?: string;
  web_url: string;
  request_access_enabled?: boolean;
  full_name: string;
  full_path: string;
  parent_id?: number;
}

// ============================================================================
// OBJECT ATTRIBUTES (Event-specific data structures)
// ============================================================================

export interface MergeRequestAttributes {
  id: number;
  iid: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed' | 'locked' | 'merged';
  created_at: string;
  updated_at: string;
  target_branch: string;
  source_branch: string;
  source_project_id: number;
  target_project_id: number;
  author_id: number;
  assignee_id?: number;
  assignee_ids?: number[];
  reviewer_ids?: number[];
  milestone_id?: number;
  merge_status: 'can_be_merged' | 'cannot_be_merged' | 'cannot_be_merged_recheck' | 'checking';
  merge_error?: string;
  merge_params?: Record<string, any>;
  merge_when_pipeline_succeeds?: boolean;
  merge_user_id?: number;
  merged_at?: string;
  closed_at?: string;
  closed_by_id?: number;
  url: string;
  source: GitLabProject;
  target: GitLabProject;
  last_commit: GitLabCommit;
  work_in_progress: boolean;
  blocking_discussions_resolved: boolean;
  first_contribution?: boolean;
  action: 'open' | 'close' | 'reopen' | 'update' | 'approved' | 'unapproved' | 'approval' | 'unapproval' | 'merge';
}

export interface IssueAttributes {
  id: number;
  iid: number;
  title: string;
  description?: string;
  state: 'opened' | 'closed' | 'reopened';
  created_at: string;
  updated_at: string;
  closed_at?: string;
  closed_by_id?: number;
  author_id: number;
  assignee_id?: number;
  assignee_ids?: number[];
  milestone_id?: number;
  project_id: number;
  relative_position?: number;
  state_id: number;
  confidential: boolean;
  discussion_locked?: boolean;
  due_date?: string;
  moved_to_id?: number;
  duplicated_to_id?: number;
  service_desk_reply_to?: string;
  time_estimate: number;
  total_time_spent: number;
  time_change: number;
  human_total_time_spent?: string;
  human_time_change?: string;
  human_time_estimate?: string;
  weight?: number;
  health_status?: string;
  url: string;
  action: 'open' | 'close' | 'reopen' | 'update';
  severity?: 'unknown' | 'info' | 'low' | 'medium' | 'high' | 'critical';
}

export interface NoteAttributes {
  id: number;
  note: string;
  noteable_type: 'Issue' | 'MergeRequest' | 'Commit' | 'Snippet';
  author_id: number;
  created_at: string;
  updated_at: string;
  project_id: number;
  attachment?: string;
  line_code?: string;
  commit_id?: string;
  noteable_id?: number;
  system: boolean;
  st_diff?: Record<string, any>;
  url: string;
  description?: string;
  action?: 'create' | 'update';
  change_position?: Record<string, any>;
  original_position?: Record<string, any>;
  position?: Record<string, any>;
  resolved_at?: string;
  resolved_by_id?: number;
  resolved_by_push?: boolean;
  discussion_id?: string;
}

export interface PipelineAttributes {
  id: number;
  iid: number;
  name?: string;
  ref: string;
  tag: boolean;
  sha: string;
  before_sha: string;
  source: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual' | 'scheduled';
  detailed_status?: string;
  stages?: string[];
  created_at: string;
  finished_at?: string;
  duration?: number;
  queued_duration?: number;
  variables?: Array<{
    key: string;
    value: string;
    variable_type: string;
  }>;
  url: string;
  action?: 'create' | 'update';
}

export interface JobAttributes {
  id: number;
  ref: string;
  tag: boolean;
  name: string;
  stage: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual' | 'scheduled';
  created_at: string;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  queued_duration?: number;
  failure_reason?: string;
  url: string;
  description?: string;
  deployment_job?: boolean;
  action?: 'create' | 'update';
}

export interface WikiPageAttributes {
  title: string;
  content: string;
  format: 'markdown' | 'rdoc' | 'asciidoc' | 'org';
  message?: string;
  slug: string;
  url: string;
  action: 'create' | 'update' | 'delete';
}

export interface DeploymentAttributes {
  id: number;
  iid: number;
  ref: string;
  tag: boolean;
  sha: string;
  status: 'created' | 'running' | 'success' | 'failed' | 'canceled' | 'blocked';
  created_at: string;
  updated_at: string;
  finished_at?: string;
  duration?: number;
  url: string;
  action?: 'create' | 'update';
}

export interface ReleaseAttributes {
  id: number;
  name: string;
  tag: string;
  description?: string;
  created_at: string;
  updated_at: string;
  released_at?: string;
  upcoming_release?: boolean;
  url: string;
  action: 'create' | 'update' | 'delete';
}

export interface FeatureFlagAttributes {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  action: 'create' | 'update' | 'delete';
}

export interface VulnerabilityAttributes {
  id: number;
  title: string;
  description?: string;
  state: 'detected' | 'confirmed' | 'resolved' | 'dismissed';
  severity: 'info' | 'unknown' | 'low' | 'medium' | 'high' | 'critical';
  confidence: 'ignore' | 'unknown' | 'experimental' | 'low' | 'medium' | 'high' | 'confirmed';
  scanner?: {
    external_id: string;
    name: string;
    vendor: string;
  };
  identifiers?: Array<{
    external_type: string;
    external_id: string;
    name: string;
    url?: string;
  }>;
  url: string;
  created_at: string;
  updated_at: string;
  action?: 'create' | 'update';
}

// ============================================================================
// WEBHOOK EVENT INTERFACES (Based on Official GitLab Docs)
// ============================================================================

/**
 * Push Hook Event
 * Triggered when code is pushed to a repository
 */
export interface PushEvent {
  object_kind: 'push';
  event_name: 'push';
  before: string;
  after: string;
  ref: string;
  ref_protected: boolean;
  checkout_sha: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  project: GitLabProject;
  repository: GitLabRepository;
  commits: GitLabCommit[];
  total_commits_count: number;
}

/**
 * Tag Push Hook Event
 * Triggered when tags are pushed to a repository
 */
export interface TagPushEvent {
  object_kind: 'tag_push';
  event_name: 'tag_push';
  before: string;
  after: string;
  ref: string;
  ref_protected: boolean;
  checkout_sha: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  project: GitLabProject;
  repository: GitLabRepository;
  commits: GitLabCommit[];
  total_commits_count: number;
}

/**
 * Issue Hook Event
 * Triggered when issues are created, updated, closed, or reopened
 */
export interface IssueEvent {
  object_kind: 'issue';
  event_name: 'issue';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: IssueAttributes;
  labels?: GitLabLabel[];
  changes?: {
    title?: { previous: string; current: string };
    description?: { previous: string; current: string };
    state_id?: { previous: number; current: number };
    updated_at?: { previous: string; current: string };
    labels?: { previous: GitLabLabel[]; current: GitLabLabel[] };
    assignees?: { previous: GitLabUser[]; current: GitLabUser[] };
  };
  repository?: GitLabRepository;
  assignees?: GitLabUser[];
}

/**
 * Confidential Issue Hook Event
 * Same as Issue Event but for confidential issues
 */
export interface ConfidentialIssueEvent extends Omit<IssueEvent, 'object_kind' | 'event_name'> {
  object_kind: 'confidential_issue';
  event_name: 'confidential_issue';
}

/**
 * Merge Request Hook Event
 * Triggered when merge requests are created, updated, merged, or closed
 */
export interface MergeRequestEvent {
  object_kind: 'merge_request';
  event_name: 'merge_request';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: MergeRequestAttributes;
  labels?: GitLabLabel[];
  changes?: {
    title?: { previous: string; current: string };
    description?: { previous: string; current: string };
    target_branch?: { previous: string; current: string };
    source_branch?: { previous: string; current: string };
    state_id?: { previous: number; current: number };
    merge_status?: { previous: string; current: string };
    updated_at?: { previous: string; current: string };
    labels?: { previous: GitLabLabel[]; current: GitLabLabel[] };
    assignees?: { previous: GitLabUser[]; current: GitLabUser[] };
    reviewers?: { previous: GitLabUser[]; current: GitLabUser[] };
  };
  repository?: GitLabRepository;
  assignees?: GitLabUser[];
  reviewers?: GitLabUser[];
}

/**
 * Note Hook Event (Comments)
 * Triggered when comments are made on commits, issues, merge requests, or snippets
 */
export interface NoteEvent {
  object_kind: 'note';
  event_name: 'note';
  user: GitLabUser;
  project_id: number;
  project: GitLabProject;
  object_attributes: NoteAttributes;
  repository?: GitLabRepository;
  commit?: GitLabCommit;
  merge_request?: {
    id: number;
    iid: number;
    title: string;
    description?: string;
    state: string;
    created_at: string;
    updated_at: string;
    target_branch: string;
    source_branch: string;
    author_id: number;
    assignee_id?: number;
    assignee_ids?: number[];
    milestone_id?: number;
    source_project_id: number;
    target_project_id: number;
    url: string;
  };
  issue?: {
    id: number;
    iid: number;
    title: string;
    description?: string;
    state: string;
    created_at: string;
    updated_at: string;
    author_id: number;
    assignee_id?: number;
    assignee_ids?: number[];
    milestone_id?: number;
    project_id: number;
    url: string;
  };
  snippet?: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    file_name: string;
    type: string;
    visibility_level: number;
  };
}

/**
 * Confidential Note Hook Event
 * Same as Note Event but for confidential comments
 */
export interface ConfidentialNoteEvent extends Omit<NoteEvent, 'object_kind' | 'event_name'> {
  object_kind: 'confidential_note';
  event_name: 'confidential_note';
}

/**
 * Wiki Page Hook Event
 * Triggered when wiki pages are created, updated, or deleted
 */
export interface WikiPageEvent {
  object_kind: 'wiki_page';
  event_name: 'wiki_page';
  user: GitLabUser;
  project: GitLabProject;
  wiki: {
    web_url: string;
    git_ssh_url: string;
    git_http_url: string;
    path_with_namespace: string;
    default_branch: string;
  };
  object_attributes: WikiPageAttributes;
}

/**
 * Pipeline Hook Event
 * Triggered when pipeline status changes
 */
export interface PipelineEvent {
  object_kind: 'pipeline';
  event_name: 'pipeline';
  object_attributes: PipelineAttributes;
  merge_request?: {
    id: number;
    iid: number;
    title: string;
    source_branch: string;
    target_branch: string;
    state: string;
    merge_status: string;
    url: string;
  };
  user: GitLabUser;
  project: GitLabProject;
  commit: GitLabCommit;
  builds?: Array<{
    id: number;
    stage: string;
    name: string;
    status: string;
    created_at: string;
    started_at?: string;
    finished_at?: string;
    when: string;
    manual: boolean;
    allow_failure: boolean;
    user: GitLabUser;
    runner?: {
      id: number;
      description: string;
      active: boolean;
      is_shared: boolean;
    };
    artifacts_file?: {
      filename: string;
      size: number;
    };
    environment?: {
      name: string;
      action: string;
      deployment_tier: string;
    };
  }>;
}

/**
 * Job Hook Event
 * Triggered when job status changes
 */
export interface JobEvent {
  object_kind: 'build'; // Note: GitLab uses 'build' for jobs in webhooks
  event_name: 'job';
  ref: string;
  tag: boolean;
  before_sha: string;
  sha: string;
  build_id: number;
  build_name: string;
  build_stage: string;
  build_status: string;
  build_created_at: string;
  build_started_at?: string;
  build_finished_at?: string;
  build_duration?: number;
  build_queued_duration?: number;
  build_allow_failure: boolean;
  build_failure_reason?: string;
  pipeline_id: number;
  project_id: number;
  project_name: string;
  user: GitLabUser;
  commit: GitLabCommit;
  repository: GitLabRepository;
  project: GitLabProject;
  runner?: {
    id: number;
    description: string;
    active: boolean;
    is_shared: boolean;
    tags?: string[];
  };
  environment?: {
    name: string;
    action: string;
    deployment_tier: string;
  };
}

/**
 * Deployment Hook Event
 * Triggered when deployments start, succeed, fail, or are canceled
 */
export interface DeploymentEvent {
  object_kind: 'deployment';
  event_name: 'deployment';
  status: string;
  status_changed_at: string;
  deployment_id: number;
  deployable_id: number;
  deployable_url: string;
  environment: string;
  project: GitLabProject;
  short_sha: string;
  user: GitLabUser;
  user_url: string;
  commit_url: string;
  commit_title: string;
}

/**
 * Feature Flag Hook Event
 * Triggered when feature flags are toggled
 */
export interface FeatureFlagEvent {
  object_kind: 'feature_flag';
  event_name: 'feature_flag';
  project: GitLabProject;
  user: GitLabUser;
  user_url: string;
  object_attributes: FeatureFlagAttributes;
}

/**
 * Release Hook Event
 * Triggered when releases are created, updated, or deleted
 */
export interface ReleaseEvent {
  object_kind: 'release';
  event_name: 'release';
  id: number;
  created_at: string;
  description: string;
  name: string;
  released_at?: string;
  tag: string;
  object_attributes: ReleaseAttributes;
  project: GitLabProject;
  url: string;
  action: 'create' | 'update' | 'delete';
  assets: {
    count: number;
    links: Array<{
      id: number;
      external: boolean;
      link_type: string;
      name: string;
      url: string;
    }>;
    sources: Array<{
      format: string;
      url: string;
    }>;
  };
  commit: GitLabCommit;
}

/**
 * Group Member Hook Event
 * Triggered when group members are added, removed, or updated
 */
export interface GroupMemberEvent {
  object_kind: 'group_member';
  event_name: 'group_member';
  created_at: string;
  updated_at: string;
  group_name: string;
  group_path: string;
  group_id: number;
  user_id: number;
  user_username: string;
  user_name: string;
  user_email: string;
  group_access: string;
  group_plan?: string;
  expires_at?: string;
  action: 'add' | 'remove' | 'update';
}

/**
 * Subgroup Hook Event
 * Triggered when subgroups are created or removed
 */
export interface SubgroupEvent {
  object_kind: 'subgroup';
  event_name: 'subgroup';
  created_at: string;
  updated_at: string;
  name: string;
  path: string;
  full_path: string;
  group_id: number;
  parent_group_id: number;
  parent_name: string;
  parent_path: string;
  parent_full_path: string;
  action: 'create' | 'destroy';
}

/**
 * Project Hook Event
 * Triggered when projects are created or deleted in a group
 */
export interface ProjectEvent {
  object_kind: 'project';
  event_name: 'project_create' | 'project_destroy' | 'project_rename' | 'project_transfer' | 'project_update';
  created_at: string;
  updated_at: string;
  name: string;
  path: string;
  path_with_namespace: string;
  project_id: number;
  owner_name: string;
  owner_email: string;
  project_visibility: string;
  action: 'create' | 'destroy' | 'rename' | 'transfer' | 'update';
}

/**
 * Milestone Hook Event
 * Triggered when milestones are created, closed, reopened, or deleted
 */
export interface MilestoneEvent {
  object_kind: 'milestone';
  event_name: 'milestone';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: {
    id: number;
    title: string;
    description?: string;
    state: 'active' | 'closed';
    created_at: string;
    updated_at: string;
    group_id?: number;
    project_id?: number;
    web_url: string;
    action: 'create' | 'close' | 'reopen' | 'destroy';
  };
}

/**
 * Emoji Hook Event
 * Triggered when emoji reactions are added or removed
 */
export interface EmojiEvent {
  object_kind: 'emoji';
  event_name: 'emoji';
  user: GitLabUser;
  project_id: number;
  project: GitLabProject;
  object_attributes: {
    user_id: number;
    created_at: string;
    id: number;
    name: string;
    awardable_type: 'Note' | 'Issue' | 'MergeRequest';
    awardable_id: number;
    updated_at: string;
    action: 'award' | 'revoke';
    awarded_on_url: string;
  };
  note?: {
    attachment?: string;
    author_id: number;
    change_position?: any;
    commit_id?: string;
    created_at: string;
    discussion_id: string;
    id: number;
    line_code?: string;
    note: string;
    noteable_id: number;
    noteable_type: string;
    original_position?: any;
    position?: any;
    project_id: number;
    resolved_at?: string;
    resolved_by_id?: number;
    resolved_by_push?: boolean;
    st_diff?: any;
    system: boolean;
    type?: string;
    updated_at: string;
    updated_by_id?: number;
    description: string;
    url: string;
  };
  issue?: {
    author_id: number;
    closed_at?: string;
    confidential: boolean;
    created_at: string;
    description: string;
    discussion_locked?: boolean;
    due_date?: string;
    id: number;
    iid: number;
    last_edited_at?: string;
    last_edited_by_id?: number;
    milestone_id?: number;
    moved_to_id?: number;
    duplicated_to_id?: number;
    project_id: number;
    relative_position?: number;
    state_id: number;
    time_estimate: number;
    title: string;
    updated_at: string;
    updated_by_id?: number;
    weight?: number;
    health_status?: string;
    url: string;
    total_time_spent: number;
    time_change: number;
    human_total_time_spent?: string;
    human_time_change?: string;
    human_time_estimate?: string;
    assignee_ids: number[];
    assignee_id?: number;
    labels: GitLabLabel[];
    state: string;
    severity?: string;
  };
}

/**
 * Work Item Hook Event
 * Triggered when work items are created, updated, closed, or reopened
 */
export interface WorkItemEvent {
  object_kind: 'work_item';
  event_name: 'work_item';
  user: GitLabUser;
  project: GitLabProject;
  object_attributes: {
    id: number;
    iid: number;
    title: string;
    description?: string;
    work_item_type_id: number;
    state: 'opened' | 'closed';
    created_at: string;
    updated_at: string;
    closed_at?: string;
    author_id: number;
    namespace_id: number;
    project_id: number;
    url: string;
    action: 'open' | 'close' | 'reopen' | 'update';
  };
}

/**
 * Access Token Hook Event
 * Triggered when project/group access tokens are about to expire
 */
export interface AccessTokenEvent {
  object_kind: 'access_token';
  event_name: 'expiring_access_token';
  project?: GitLabProject;
  group?: {
    group_name: string;
    group_path: string;
    group_id: number;
    full_path: string;
  };
  object_attributes: {
    user_id: number;
    created_at: string;
    id: number;
    name: string;
    expires_at: string;
  };
}

/**
 * Vulnerability Hook Event
 * Triggered when vulnerabilities are created or updated
 */
export interface VulnerabilityEvent {
  object_kind: 'vulnerability';
  event_name: 'vulnerability';
  project: GitLabProject;
  object_attributes: VulnerabilityAttributes;
}

// ============================================================================
// UNION TYPE FOR ALL WEBHOOK EVENTS
// ============================================================================

/**
 * Union type representing all possible GitLab webhook events
 * Based on the official GitLab webhook events documentation
 */
export type GitLabWebhookEvents =
  | PushEvent
  | TagPushEvent
  | IssueEvent
  | ConfidentialIssueEvent
  | NoteEvent
  | ConfidentialNoteEvent
  | MergeRequestEvent
  | WikiPageEvent
  | PipelineEvent
  | JobEvent
  | DeploymentEvent
  | FeatureFlagEvent
  | ReleaseEvent
  | GroupMemberEvent
  | SubgroupEvent
  | ProjectEvent
  | MilestoneEvent
  | EmojiEvent
  | WorkItemEvent
  | AccessTokenEvent
  | VulnerabilityEvent;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract event type from webhook event
 */
export type GitLabEventKind = GitLabWebhookEvents['object_kind'];

/**
 * Extract specific event by object_kind
 */
export type GitLabEventByKind<T extends GitLabEventKind> = Extract<GitLabWebhookEvents, { object_kind: T }>;

/**
 * Common webhook metadata
 */
export interface GitLabWebhookMeta {
  event_id: string;
  event_type: string;
  received_at: Date;
  project_id: string;
  gitlab_instance?: string;
}
