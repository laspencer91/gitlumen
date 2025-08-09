import { ProviderEvent } from '@gitlumen/core';

export class GitLabEventParser {
  parse(payload: any): ProviderEvent {
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

  private parseMergeRequestEvent(payload: any): ProviderEvent {
    const mr = payload.object_attributes;
    const project = payload.project;
    
    return {
      id: `${payload.object_kind}_${mr.id}`,
      type: 'merge_request',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: mr.source_branch,
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: mr.title,
      description: mr.description,
      url: mr.url,
      timestamp: new Date(mr.updated_at || mr.created_at),
      metadata: {
        sourceBranch: mr.source_branch,
        targetBranch: mr.target_branch,
        state: mr.state,
        mergeStatus: mr.merge_status,
        action: payload.object_attributes?.action || 'update',
        labels: payload.labels?.map((l: any) => l.name) || [],
        assignees: payload.assignees?.map((a: any) => a.name) || [],
      },
    };
  }

  private parsePipelineEvent(payload: any): ProviderEvent {
    const pipeline = payload.object_attributes;
    const project = payload.project;
    
    return {
      id: `${payload.object_kind}_${pipeline.id}`,
      type: 'pipeline',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: pipeline.ref,
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: `Pipeline ${pipeline.status} for ${pipeline.ref}`,
      description: `Pipeline ${pipeline.id} ${pipeline.status}`,
      url: `${project.web_url}/-/pipelines/${pipeline.id}`,
      timestamp: new Date(pipeline.updated_at || pipeline.created_at),
      metadata: {
        pipelineId: pipeline.id,
        status: pipeline.status,
        ref: pipeline.ref,
        sha: pipeline.sha,
        duration: pipeline.duration,
        stages: payload.builds?.map((b: any) => ({
          name: b.stage,
          status: b.status,
          duration: b.duration,
        })) || [],
      },
    };
  }

  private parseIssueEvent(payload: any): ProviderEvent {
    const issue = payload.object_attributes;
    const project = payload.project;
    
    return {
      id: `${payload.object_kind}_${issue.id}`,
      type: 'issue',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: 'N/A',
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: issue.title,
      description: issue.description,
      url: issue.url,
      timestamp: new Date(issue.updated_at || issue.created_at),
      metadata: {
        issueId: issue.id,
        state: issue.state,
        action: issue.action || 'update',
        labels: payload.labels?.map((l: any) => l.name) || [],
        assignees: payload.assignees?.map((a: any) => a.name) || [],
        milestone: issue.milestone?.title,
      },
    };
  }

  private parsePushEvent(payload: any): ProviderEvent {
    const project = payload.project;
    const commits = payload.commits || [];
    const lastCommit = commits[commits.length - 1];
    
    return {
      id: `${payload.object_kind}_${project.id}_${Date.now()}`,
      type: 'push',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: payload.ref.replace('refs/heads/', ''),
      author: lastCommit?.author?.name || 'Unknown',
      title: `Push to ${payload.ref.replace('refs/heads/', '')}`,
      description: `${commits.length} commit(s) pushed`,
      url: `${project.web_url}/-/commits/${payload.ref.replace('refs/heads/', '')}`,
      timestamp: new Date(payload.commits?.[0]?.timestamp || Date.now()),
      metadata: {
        ref: payload.ref,
        before: payload.before,
        after: payload.after,
        commitCount: commits.length,
        commits: commits.map((c: any) => ({
          id: c.id,
          message: c.message,
          author: c.author.name,
          timestamp: c.timestamp,
        })),
      },
    };
  }

  private parseTagPushEvent(payload: any): ProviderEvent {
    const project = payload.project;
    
    return {
      id: `${payload.object_kind}_${project.id}_${Date.now()}`,
      type: 'tag_push',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: 'N/A',
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: `Tag ${payload.ref.replace('refs/tags/', '')} ${payload.before === '0000000000000000000000000000000000000000' ? 'created' : 'deleted'}`,
      description: `Tag ${payload.ref.replace('refs/tags/', '')} was ${payload.before === '0000000000000000000000000000000000000000' ? 'created' : 'deleted'}`,
      url: `${project.web_url}/-/tags/${payload.ref.replace('refs/tags/', '')}`,
      timestamp: new Date(),
      metadata: {
        ref: payload.ref,
        before: payload.before,
        after: payload.after,
        action: payload.before === '0000000000000000000000000000000000000000' ? 'created' : 'deleted',
      },
    };
  }

  private parseNoteEvent(payload: any): ProviderEvent {
    const note = payload.object_attributes;
    const project = payload.project;
    
    return {
      id: `${payload.object_kind}_${note.id}`,
      type: 'note',
      projectId: project.id.toString(),
      projectName: project.name,
      branch: 'N/A',
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: `Comment on ${payload.noteable_type}`,
      description: note.note,
      url: note.url,
      timestamp: new Date(note.updated_at || note.created_at),
      metadata: {
        noteId: note.id,
        noteableType: note.noteable_type,
        noteableId: note.noteable_id,
        note: note.note,
        action: 'created',
      },
    };
  }

  private parseGenericEvent(payload: any): ProviderEvent {
    const project = payload.project || {};
    
    return {
      id: `${payload.object_kind}_${Date.now()}`,
      type: payload.object_kind,
      projectId: project.id?.toString() || 'unknown',
      projectName: project.name || 'Unknown Project',
      branch: 'N/A',
      author: payload.user?.name || payload.user?.username || 'Unknown',
      title: `${payload.object_kind} event`,
      description: `Generic ${payload.object_kind} event`,
      url: project.web_url || '#',
      timestamp: new Date(),
      metadata: {
        objectKind: payload.object_kind,
        rawPayload: payload,
      },
    };
  }
} 