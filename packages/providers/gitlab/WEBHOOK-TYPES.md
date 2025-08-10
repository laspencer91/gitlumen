# GitLab Webhook Types

This package provides **comprehensive, up-to-date TypeScript definitions** for all GitLab webhook events based on the [official GitLab webhook events documentation](https://docs.gitlab.com/user/project/integrations/webhook_events/).

## 🎯 What's Included

### **Complete Event Coverage**
All GitLab webhook events are fully typed:

- ✅ **Push Hook** - Code pushes to repository
- ✅ **Tag Push Hook** - Tag creation/deletion 
- ✅ **Issue Hook** - Issue lifecycle events
- ✅ **Confidential Issue Hook** - Confidential issue events
- ✅ **Note Hook** - Comments on various objects
- ✅ **Confidential Note Hook** - Confidential comments
- ✅ **Merge Request Hook** - MR lifecycle events
- ✅ **Wiki Page Hook** - Wiki page changes
- ✅ **Pipeline Hook** - Pipeline status changes
- ✅ **Job Hook** - Individual job status changes
- ✅ **Deployment Hook** - Deployment events
- ✅ **Feature Flag Hook** - Feature flag toggles
- ✅ **Release Hook** - Release management
- ✅ **Group Member Hook** - Group membership changes
- ✅ **Subgroup Hook** - Subgroup management
- ✅ **Project Hook** - Project lifecycle
- ✅ **Milestone Hook** - Milestone management
- ✅ **Emoji Hook** - Emoji reactions
- ✅ **Work Item Hook** - Work item events
- ✅ **Access Token Hook** - Token expiration warnings
- ✅ **Vulnerability Hook** - Security vulnerability events

### **Enhanced Type Safety**
- **Discriminated unions** for precise event type checking
- **Header types** for GitLab webhook headers (`X-Gitlab-Event`, etc.)
- **Utility types** for event processing and metadata
- **Complete object attributes** for all event types

## 🚀 Usage

### Basic Usage

```typescript
import type { 
  GitLabWebhookEvents, 
  GitLabEventType, 
  GitLabWebhookHeaders,
  MergeRequestEvent,
  PushEvent 
} from '@gitlumen/provider-gitlab';

// Type-safe webhook handler
function handleWebhook(
  headers: GitLabWebhookHeaders,
  body: GitLabWebhookEvents
) {
  const eventType = headers['x-gitlab-event'];
  
  // TypeScript knows the exact event types!
  switch (body.object_kind) {
    case 'merge_request':
      // body is now typed as MergeRequestEvent
      console.log(`MR: ${body.object_attributes.title}`);
      break;
      
    case 'push':
      // body is now typed as PushEvent  
      console.log(`Push: ${body.total_commits_count} commits`);
      break;
  }
}
```

### Type Guards

```typescript
import type { GitLabWebhookEvents, MergeRequestEvent } from '@gitlumen/provider-gitlab';

function isMergeRequestEvent(event: GitLabWebhookEvents): event is MergeRequestEvent {
  return event.object_kind === 'merge_request';
}

// Usage
if (isMergeRequestEvent(webhook)) {
  // Full type safety for MR-specific properties
  const { title, state, source_branch, target_branch } = webhook.object_attributes;
  console.log(`MR "${title}" from ${source_branch} to ${target_branch} is ${state}`);
}
```

### Event-Specific Types

```typescript
import type { 
  IssueEvent, 
  PipelineEvent, 
  NoteEvent 
} from '@gitlumen/provider-gitlab';

// Handle specific event types
function handleIssueEvent(event: IssueEvent) {
  const { title, state, assignee_ids } = event.object_attributes;
  const labels = event.labels || [];
  
  // Access to changes for update events
  if (event.changes?.labels) {
    console.log('Labels changed:', {
      from: event.changes.labels.previous,
      to: event.changes.labels.current
    });
  }
}

function handlePipelineEvent(event: PipelineEvent) {
  const { status, ref, sha } = event.object_attributes;
  
  if (event.builds) {
    const failedJobs = event.builds.filter(job => job.status === 'failed');
    console.log(`Pipeline ${status}, ${failedJobs.length} failed jobs`);
  }
}
```

### Rich Change Detection

```typescript
import type { MergeRequestEvent } from '@gitlumen/provider-gitlab';

function detectMRChanges(event: MergeRequestEvent) {
  const changes = event.changes;
  if (!changes) return;
  
  // Label changes
  if (changes.labels) {
    const added = changes.labels.current.filter(
      label => !changes.labels!.previous.find(p => p.id === label.id)
    );
    const removed = changes.labels.previous.filter(
      label => !changes.labels!.current.find(c => c.id === label.id)
    );
    
    console.log('Label changes:', { added, removed });
  }
  
  // Assignee changes  
  if (changes.assignees) {
    console.log('Assignee changes:', {
      from: changes.assignees.previous.map(a => a.username),
      to: changes.assignees.current.map(a => a.username)
    });
  }
  
  // State changes
  if (changes.state_id) {
    console.log(`State changed from ${changes.state_id.previous} to ${changes.state_id.current}`);
  }
}
```

## 📊 Differences from `gitlab-event-types`

Our types are **more complete and accurate** than the existing `gitlab-event-types` package:

| Feature | `gitlab-event-types` | `@gitlumen/provider-gitlab` |
|---------|---------------------|---------------------------|
| **Event Coverage** | 11 events, many incomplete | **22 events**, all complete |
| **Work Item Events** | ❌ Missing | ✅ Full support |
| **Vulnerability Events** | ❌ Missing | ✅ Full support |
| **Access Token Events** | ❌ Missing | ✅ Full support |
| **Job Events** | ❌ Missing | ✅ Full support |
| **Milestone Events** | ❌ Missing | ✅ Full support |
| **Change Detection** | ⚠️ Basic | ✅ Comprehensive |
| **Header Types** | ❌ None | ✅ Complete |
| **Documentation Sync** | ⚠️ Outdated | ✅ Current (2025) |

## 🔧 Advanced Usage

### Event Processing Pipeline

```typescript
import type { 
  GitLabWebhookEvents, 
  GitLabEventKind,
  GitLabWebhookMeta 
} from '@gitlumen/provider-gitlab';

interface EnrichedEvent<T extends GitLabWebhookEvents = GitLabWebhookEvents> {
  raw: T;
  meta: GitLabWebhookMeta;
  insights: {
    isBreakingChange?: boolean;
    hasLabelChanges?: boolean;
    labelChanges?: { added: string[]; removed: string[] };
    // Add more insights as needed
  };
}

class GitLabEventProcessor {
  enrich<T extends GitLabWebhookEvents>(
    event: T,
    meta: GitLabWebhookMeta
  ): EnrichedEvent<T> {
    return {
      raw: event,
      meta,
      insights: this.extractInsights(event)
    };
  }
  
  private extractInsights(event: GitLabWebhookEvents) {
    const insights: any = {};
    
    if (event.object_kind === 'merge_request' && event.changes?.labels) {
      insights.hasLabelChanges = true;
      insights.labelChanges = this.calculateLabelChanges(event.changes.labels);
    }
    
    return insights;
  }
}
```

## 📚 Type Reference

### Main Types
- `GitLabWebhookEvents` - Union of all webhook events
- `GitLabEventType` - Header event type strings  
- `GitLabWebhookHeaders` - Webhook request headers
- `GitLabEventKind` - Event object_kind values

### Event Types
- `PushEvent`, `TagPushEvent`
- `IssueEvent`, `ConfidentialIssueEvent`
- `MergeRequestEvent` 
- `NoteEvent`, `ConfidentialNoteEvent`
- `WikiPageEvent`, `PipelineEvent`, `JobEvent`
- `DeploymentEvent`, `ReleaseEvent`
- `FeatureFlagEvent`, `VulnerabilityEvent`
- `GroupMemberEvent`, `SubgroupEvent`, `ProjectEvent`
- `MilestoneEvent`, `EmojiEvent`, `WorkItemEvent`
- `AccessTokenEvent`

### Utility Types
- `GitLabEventByKind<T>` - Extract event by object_kind
- `Compare<T>` - Change tracking
- `WebhookResponse` - Standard response format

## 🎯 Perfect for GitLumen

These types are specifically designed for GitLumen's event processing pipeline, providing the rich type information needed for:

- **Smart event enrichment** 
- **Label change detection**
- **State transition tracking**
- **Plugin development**
- **Notification routing**

Happy coding! 🚀