import { JsonObject, ProviderEvent } from '@gitlumen/core';
import {
  GitLabWebhookPayload,
  GitLabMergeRequestPayload,
  GitLabPipelinePayload,
  GitLabIssuePayload,
  GitLabPushPayload,
  GitLabTagPushPayload,
  GitLabNotePayload,
} from './types';

export class GitLabEventParser {
  parse(payload: GitLabWebhookPayload): ProviderEvent {
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

  private parseMergeRequestEvent(payload: GitLabMergeRequestPayload): ProviderEvent {
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
        sourceBranch: mr.source_branch,
        targetBranch: mr.target_branch,
        state: mr.state,
        mergeStatus: mr.merge_status,
        action: mr.action || 'update',
        labels: payload.labels?.map(l => l.name) || [],
        assignees: payload.assignees?.map(a => a.name) || [],
      },
    };
  }

  private parsePipelineEvent(payload: GitLabPipelinePayload): ProviderEvent {
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
        status: pipeline.status,
        ref: pipeline.ref,
        sha: pipeline.sha,
        duration: pipeline.duration || 0,
        stages: payload.builds?.map(b => ({
          name: b.stage,
          status: b.status,
          duration: b.duration || 0,
        })) || [],
      },
    };
  }

  private parseIssueEvent(payload: GitLabIssuePayload): ProviderEvent {
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
        state: issue.state,
        action: issue.action || 'update',
        labels: payload.labels?.map(l => l.name) || [],
        assignees: payload.assignees?.map(a => a.name) || [],
        milestone: payload.milestone?.title || null,
      },
    };
  }

  private parsePushEvent(payload: GitLabPushPayload): ProviderEvent {
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
        commitCount: commitCount,
        commits: commits.map(c => ({
          id: c.id,
          message: c.message,
          author: c.author.name,
          timestamp: c.timestamp,
        })),
      },
    };
  }

  private parseTagPushEvent(payload: GitLabTagPushPayload): ProviderEvent {
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
        tag: tag,
        ref: payload.ref,
        after: payload.after,
      },
    };
  }

  private parseNoteEvent(payload: GitLabNotePayload): ProviderEvent {
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
      },
    };
  }

  private parseGenericEvent(payload: GitLabWebhookPayload): ProviderEvent {
    const eventType = payload.object_kind;
    const project = 'project' in payload ? payload.project : null;
    const user = 'user' in payload ? payload.user : null;

    return {
      id: `${eventType}_${project?.id || 'unknown'}_${Date.now()}`,
      type: eventType,
      projectId: project?.id.toString() || 'unknown',
      projectName: project?.name || 'Unknown Project',
      branch: 'N/A',
      author: user?.name || user?.username || 'Unknown',
      title: `${eventType} event`,
      description: `Generic ${eventType} event`,
      url: project?.web_url || '#',
      timestamp: new Date(),
      metadata: payload as unknown as JsonObject, // Generic fallback
    };
  }
}
