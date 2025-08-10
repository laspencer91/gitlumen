/**
 * GitLab-specific provider events with strongly-typed metadata
 * Uses the universal core event types with GitLab-specific metadata
 */

import {
  MergeRequestDevelopmentEvent,
  PipelineDevelopmentEvent,
  IssueDevelopmentEvent,
  PushDevelopmentEvent,
  TagPushDevelopmentEvent,
  NoteDevelopmentEvent,
  JobDevelopmentEvent,
  WikiPageDevelopmentEvent,
  DeploymentDevelopmentEvent,
  ReleaseDevelopmentEvent,
  GenericDevelopmentEvent,
  AnyDevelopmentEvent
} from '@gitlumen/core';
import {
  MergeRequestMetadata,
  PipelineMetadata,
  IssueMetadata,
  PushMetadata,
  TagPushMetadata,
  NoteMetadata,
  JobMetadata,
  WikiPageMetadata,
  DeploymentMetadata,
  ReleaseMetadata,
  GenericEventMetadata,
  EventMetadata
} from './event-metadata';

// =============================================================================
// GITLAB-SPECIFIC TYPED EVENTS
// =============================================================================
// These use the universal core event types with GitLab-specific metadata

/**
 * GitLab Merge Request event with GitLab-specific metadata
 */
export type GitLabMergeRequestEvent = MergeRequestDevelopmentEvent<MergeRequestMetadata>;

/**
 * GitLab Pipeline event with GitLab-specific metadata
 */
export type GitLabPipelineEvent = PipelineDevelopmentEvent<PipelineMetadata>;

/**
 * GitLab Issue event with GitLab-specific metadata
 */
export type GitLabIssueEvent = IssueDevelopmentEvent<IssueMetadata>;

/**
 * GitLab Push event with GitLab-specific metadata
 */
export type GitLabPushEvent = PushDevelopmentEvent<PushMetadata>;

/**
 * GitLab Tag Push event with GitLab-specific metadata
 */
export type GitLabTagPushEvent = TagPushDevelopmentEvent<TagPushMetadata>;

/**
 * GitLab Note (Comment) event with GitLab-specific metadata
 */
export type GitLabNoteEvent = NoteDevelopmentEvent<NoteMetadata>;

/**
 * GitLab Job (Build) event with GitLab-specific metadata
 */
export type GitLabJobEvent = JobDevelopmentEvent<JobMetadata>;

/**
 * GitLab Wiki Page event with GitLab-specific metadata
 */
export type GitLabWikiPageEvent = WikiPageDevelopmentEvent<WikiPageMetadata>;

/**
 * GitLab Deployment event with GitLab-specific metadata
 */
export type GitLabDeploymentEvent = DeploymentDevelopmentEvent<DeploymentMetadata>;

/**
 * GitLab Release event with GitLab-specific metadata
 */
export type GitLabReleaseEvent = ReleaseDevelopmentEvent<ReleaseMetadata>;

/**
 * GitLab Generic event for unknown/unsupported events
 */
export type GitLabGenericEvent = GenericDevelopmentEvent<GenericEventMetadata>;

/**
 * Union type for all GitLab development events
 * Use this when you need to handle any GitLab event type
 */
export type GitLabDevelopmentEvent =
  | GitLabMergeRequestEvent
  | GitLabPipelineEvent
  | GitLabIssueEvent
  | GitLabPushEvent
  | GitLabTagPushEvent
  | GitLabNoteEvent
  | GitLabJobEvent
  | GitLabWikiPageEvent
  | GitLabDeploymentEvent
  | GitLabReleaseEvent
  | GitLabGenericEvent;

/**
 * All GitLab development events as universal type
 * Useful for event processing that works across providers
 */
export type AnyGitLabDevelopmentEvent = AnyDevelopmentEvent<EventMetadata>;
