/**
 * Core Development Event Types
 *
 * These are universal event types that can be used across all providers.
 * Provider-specific metadata should be defined in the provider packages.
 */

import { MetadataObject, JsonValue } from './common.types';

/**
 * Union type for all supported development event types
 */
export type DevelopmentEventType =
  | 'merge_request'
  | 'pipeline'
  | 'issue'
  | 'push'
  | 'tag_push'
  | 'note'
  | 'job'
  | 'wiki_page'
  | 'deployment'
  | 'release';

/**
 * Base metadata interface that all provider metadata should extend
 */
export interface BaseDevelopmentEventMetadata {
  [key: string]: JsonValue | undefined;
}

/**
 * Common development event structure
 * Providers should use this with their specific metadata types
 */
export interface DevelopmentEvent<TMetadata = MetadataObject> {
  id: string;
  type: DevelopmentEventType;
  projectId: string;
  projectName: string;
  branch: string;
  author: string;
  title: string;
  description?: string;
  url: string;
  timestamp: Date;
  metadata: TMetadata;
}



/**
 * Helper type for strongly-typed development events
 */
export type TypedDevelopmentEvent<T extends DevelopmentEventType, M extends BaseDevelopmentEventMetadata> =
  DevelopmentEvent<M> & { type: T };

// =============================================================================
// UNIVERSAL DEVELOPMENT EVENT STRUCTURES
// =============================================================================
// These can be implemented by any provider (GitLab, GitHub, Bitbucket, etc.)
// Provider-specific metadata goes in the TMetadata generic

/**
 * Merge Request/Pull Request development event
 * Represents merge requests (GitLab), pull requests (GitHub), etc.
 */
export type MergeRequestDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'merge_request', TMetadata>;

/**
 * Pipeline/Workflow development event
 * Represents CI/CD pipelines, GitHub Actions workflows, etc.
 */
export type PipelineDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'pipeline', TMetadata>;

/**
 * Issue development event
 * Represents issues across all platforms
 */
export type IssueDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'issue', TMetadata>;

/**
 * Push development event
 * Represents code pushes to repositories
 */
export type PushDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'push', TMetadata>;

/**
 * Tag Push development event
 * Represents tag/release pushes
 */
export type TagPushDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'tag_push', TMetadata>;

/**
 * Note/Comment development event
 * Represents comments on MRs, issues, commits, etc.
 */
export type NoteDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'note', TMetadata>;

/**
 * Job/Build development event
 * Represents individual CI/CD jobs within pipelines
 */
export type JobDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'job', TMetadata>;

/**
 * Wiki Page development event
 * Represents wiki page changes
 */
export type WikiPageDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'wiki_page', TMetadata>;

/**
 * Deployment development event
 * Represents deployments to environments
 */
export type DeploymentDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'deployment', TMetadata>;

/**
 * Release development event
 * Represents software releases
 */
export type ReleaseDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  TypedDevelopmentEvent<'release', TMetadata>;

/**
 * Generic development event for unknown/unsupported event types
 */
export type GenericDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  DevelopmentEvent<TMetadata & {
    eventType: string;
    rawData?: Record<string, any>;
  }>;

/**
 * Union type for all universal development events
 * Any provider can return events of these types
 */
export type AnyDevelopmentEvent<TMetadata extends BaseDevelopmentEventMetadata = BaseDevelopmentEventMetadata> =
  | MergeRequestDevelopmentEvent<TMetadata>
  | PipelineDevelopmentEvent<TMetadata>
  | IssueDevelopmentEvent<TMetadata>
  | PushDevelopmentEvent<TMetadata>
  | TagPushDevelopmentEvent<TMetadata>
  | NoteDevelopmentEvent<TMetadata>
  | JobDevelopmentEvent<TMetadata>
  | WikiPageDevelopmentEvent<TMetadata>
  | DeploymentDevelopmentEvent<TMetadata>
  | ReleaseDevelopmentEvent<TMetadata>
