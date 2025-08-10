import {
  GitLabWebhookEvents,
  MergeRequestEvent,
  PipelineEvent,
  IssueEvent,
  PushEvent,
  TagPushEvent,
  NoteEvent, SupportedGitLabWebhookEvents,
} from './webhook-types';
import {
  MergeRequestMetadata,
  PipelineMetadata,
  IssueMetadata,
  PushMetadata,
  TagPushMetadata,
  NoteMetadata,
  GenericEventMetadata
} from './event-metadata';
import {
  GitLabDevelopmentEvent,
  GitLabIssueEvent,
  GitLabMergeRequestEvent,
  GitLabNoteEvent,
  GitLabPipelineEvent,
  GitLabPushEvent,
  GitLabTagPushEvent,
  GitLabGenericEvent,
} from './provider-event';
import { JsonValue } from '@gitlumen/core';

export class GitLabEventParser {
  parse(payload: GitLabWebhookEvents): GitLabDevelopmentEvent {
    const objectKind = payload.object_kind;

    switch (objectKind) {
      case 'merge_request':
        return this.parseMergeRequestEvent(payload);
      case 'pipeline':
        return this.parsePipelineEvent(payload);
      case 'issue':
        return this.parseIssueEvent(payload);
      case 'push':
        return this.parsePushEvent(payload);
      case 'tag_push':
        return this.parseTagPushEvent(payload);
      case 'note':
        return this.parseNoteEvent(payload);
      default:
        return this.parseGenericEvent(payload);
    }
  }

  private parseMergeRequestEvent(payload: MergeRequestEvent): GitLabMergeRequestEvent {
    const mr = payload.object_attributes;
    const project = payload.project;
    const user = payload.user;

    return {
      id: `${payload.object_kind}_${mr.id}`,
      type: 'merge_request',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: mr.source_branch,
      author: user.name || user.username || 'Unknown',
      title: mr.title,
      description: mr.description || '',
      url: mr.url,
      timestamp: new Date(mr.updated_at || mr.created_at),
      metadata: {
        mergeRequestId: mr.id,
        mergeRequestIid: mr.iid,
        sourceBranch: mr.source_branch,
        targetBranch: mr.target_branch,
        state: mr.state,
        action: mr.action || 'update',
        mergeStatus: mr.merge_status,
        workInProgress: mr.work_in_progress,
        assignees: payload.assignees?.map(a => a.name) || [],
        reviewers: payload.reviewers?.map(r => r.name) || [],
        labels: payload.labels?.map(l => l.name) || [],
        milestoneId: mr.milestone_id,
        blockingDiscussionsResolved: mr.blocking_discussions_resolved,
      } as MergeRequestMetadata,
    };
  }

  private parsePipelineEvent(payload: PipelineEvent): GitLabPipelineEvent {
    const pipeline = payload.object_attributes;
    const project = payload.project;
    const user = payload.user;

    return {
      id: `${payload.object_kind}_${pipeline.id}`,
      type: 'pipeline',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: pipeline.ref,
      author: user.name || user.username || 'Unknown',
      title: `Pipeline ${pipeline.status} for ${pipeline.ref}`,
      description: `Pipeline ${pipeline.id} ${pipeline.status}`,
      url: `${project.web_url}/-/pipelines/${pipeline.id}`,
      timestamp: new Date(pipeline.finished_at || pipeline.created_at),
      metadata: {
        pipelineId: pipeline.id,
        pipelineIid: pipeline.iid,
        status: pipeline.status,
        ref: pipeline.ref,
        sha: pipeline.sha,
        beforeSha: pipeline.before_sha,
        source: pipeline.source,
        tag: pipeline.tag,
        duration: pipeline.duration,
        queuedDuration: pipeline.queued_duration,
        createdAt: pipeline.created_at,
        finishedAt: pipeline.finished_at,
        stages: payload.builds?.map(b => ({
          name: b.stage,
          status: b.status,
          allowFailure: b.allow_failure,
        })) || [],
        mergeRequest: payload.merge_request ? {
          id: payload.merge_request.id,
          iid: payload.merge_request.iid,
          title: payload.merge_request.title,
          sourceBranch: payload.merge_request.source_branch,
          targetBranch: payload.merge_request.target_branch,
          state: payload.merge_request.state,
          mergeStatus: payload.merge_request.merge_status,
        } : undefined,
      } as PipelineMetadata,
    };
  }

  private parseIssueEvent(payload: IssueEvent): GitLabIssueEvent {
    const issue = payload.object_attributes;
    const project = payload.project;
    const user = payload.user;

    return {
      id: `${payload.object_kind}_${issue.id}`,
      type: 'issue',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: 'N/A',
      author: user.name || user.username || 'Unknown',
      title: issue.title,
      description: issue.description || '',
      url: issue.url,
      timestamp: new Date(issue.updated_at || issue.created_at),
      metadata: {
        issueId: issue.id,
        issueIid: issue.iid,
        state: issue.state,
        action: issue.action || 'update',
        confidential: issue.confidential,
        labels: payload.labels?.map(l => l.name) || [],
        assignees: payload.assignees?.map(a => a.name) || [],
        milestoneId: issue.milestone_id || undefined,
        dueDate: issue.due_date,
        timeEstimate: issue.time_estimate,
        totalTimeSpent: issue.total_time_spent,
        weight: issue.weight,
        healthStatus: issue.health_status,
        severity: issue.severity,
      } as IssueMetadata,
    };
  }

  private parsePushEvent(payload: PushEvent): GitLabPushEvent {
    const project = payload.project;
    const commits = payload.commits;
    const branch = payload.ref.replace('refs/heads/', '');
    const commitCount = commits.length;
    const firstCommit = commits[0];

    return {
      id: `${payload.object_kind}_${project.id}`,
      type: 'push',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: branch,
      author: payload.user_name,
      title: `${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${branch}`,
      description: firstCommit?.message || '',
      url: `${project.web_url}/-/tree/${branch}`,
      timestamp: new Date(firstCommit?.timestamp || Date.now()),
      metadata: {
        ref: payload.ref,
        before: payload.before,
        after: payload.after,
        checkoutSha: payload.checkout_sha,
        refProtected: payload.ref_protected,
        totalCommitsCount: payload.total_commits_count,
        commits: commits.map(c => ({
          id: c.id,
          message: c.message,
          title: c.title,
          timestamp: c.timestamp,
          url: c.url,
          author: {
            name: c.author.name,
            email: c.author.email,
          },
          added: c.added,
          modified: c.modified,
          removed: c.removed,
        })),
      } as PushMetadata,
    };
  }

  private parseTagPushEvent(payload: TagPushEvent): GitLabTagPushEvent {
    const project = payload.project;
    const tag = payload.ref.replace('refs/tags/', '');

    return {
      id: `${payload.object_kind}_${project.id}`,
      type: 'tag_push',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: tag,
      author: payload.user_name,
      title: `Tag ${tag} created`,
      description: `New tag ${tag} created`,
      url: `${project.web_url}/-/tags/${tag}`,
      timestamp: new Date(),
      metadata: {
        ref: payload.ref,
        before: payload.before,
        after: payload.after,
        checkoutSha: payload.checkout_sha,
        tag: tag,
        totalCommitsCount: payload.total_commits_count,
        commits: payload.commits.map(c => ({
          id: c.id,
          message: c.message,
          timestamp: c.timestamp,
          url: c.url,
          author: {
            name: c.author.name,
            email: c.author.email,
          },
        })),
      } as TagPushMetadata,
    };
  }

  private parseNoteEvent(payload: NoteEvent): GitLabNoteEvent {
    const note = payload.object_attributes;
    const project = payload.project;
    const user = payload.user;

    return {
      id: `${payload.object_kind}_${note.id}`,
      type: 'note',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: 'N/A',
      author: user.name || user.username || 'Unknown',
      title: `Comment on ${note.noteable_type}`,
      description: note.note,
      url: note.url,
      timestamp: new Date(note.updated_at || note.created_at),
      metadata: {
        noteId: note.id,
        noteableType: note.noteable_type,
        noteableId: note.noteable_id,
        note: note.note,
        system: note.system,
        lineCode: note.line_code,
        commitId: note.commit_id,
        discussionId: note.discussion_id,
        resolved: !!note.resolved_at,
        resolvedAt: note.resolved_at,
        resolvedById: note.resolved_by_id,
        mergeRequest: payload.merge_request ? {
          id: payload.merge_request.id,
          iid: payload.merge_request.iid,
          title: payload.merge_request.title,
          state: payload.merge_request.state,
          sourceBranch: payload.merge_request.source_branch,
          targetBranch: payload.merge_request.target_branch,
        } : undefined,
        issue: payload.issue ? {
          id: payload.issue.id,
          iid: payload.issue.iid,
          title: payload.issue.title,
          state: payload.issue.state,
        } : undefined,
      } as NoteMetadata,
    };
  }

  private parseGenericEvent(payload: GitLabWebhookEvents): GitLabGenericEvent {
    const eventType = payload.object_kind as typeof SupportedGitLabWebhookEvents[number];
    const project = 'project' in payload ? payload.project : null;
    const user = 'user' in payload ? payload.user : null;

    return {
      id: `${eventType}_${project?.id || 'unknown'}_${Date.now()}`,
      type: eventType ,
      projectId: project?.id.toString() || 'unknown',
      projectName: project?.name || 'Unknown Project',
      branch: 'N/A',
      author: user?.name || user?.username || 'Unknown',
      title: `${eventType} event`,
      description: `Generic ${eventType} event`,
      url: project?.web_url || '#',
      timestamp: new Date(),
      metadata: {
        eventType: eventType,
        objectKind: payload.object_kind,
        rawData: payload as unknown as JsonValue,
      } as GenericEventMetadata,
    };
  }

  private eventTypeToDevelopmentEvent(eventType: GitLabWebhookEvents['event_name']) {
    switch (eventType) {
      case 'confidential_issue':
    }
  }
}
