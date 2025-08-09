# Microsoft Teams Integration Setup 💬

Learn how to configure GitLumen to send notifications to Microsoft Teams channels.

## Overview

GitLumen integrates with Microsoft Teams through:
- **Incoming Webhooks** - Send notifications to specific channels
- **Adaptive Cards** - Rich, interactive message formatting
- **Custom Templates** - Tailored notifications for different events
- **Smart Filtering** - Control when and what gets notified

## Prerequisites

- Microsoft Teams account with admin permissions
- Access to the Teams channel where you want notifications
- GitLumen instance running and configured

## Step 1: Create Teams Incoming Webhook

1. **Navigate to Your Team Channel**
   - Open Microsoft Teams
   - Go to the team and channel where you want notifications
   - Click the **...** (more options) menu

2. **Add Connector**
   - Select **Connectors** from the menu
   - Find **Incoming Webhook** in the list
   - Click **Configure**

3. **Configure Webhook**
   - **Webhook name**: `GitLumen Notifications`
   - **Description**: `Development activity notifications from GitLumen`
   - **Upload image**: Optional - you can use the GitLumen logo
   - Click **Create**

4. **Copy Webhook URL**
   - Copy the generated webhook URL
   - **Keep this secure** - anyone with this URL can post to your channel

## Step 2: Configure GitLumen Teams Plugin

1. **Update Environment Variables**
   ```env
   # Teams Configuration
   TEAMS_WEBHOOK_URL=https://your-org.webhook.office.com/webhookb2/...
   TEAMS_NOTIFICATION_ENABLED=true
   ```

2. **Create Teams Plugin Configuration**
   - Open GitLumen web interface
   - Navigate to **Settings** → **Plugins** → **Teams**
   - Enter your Teams webhook URL
   - Configure notification preferences

## Step 3: Test Integration

1. **Send Test Notification**
   ```bash
   # Test from command line
   curl -H "Content-Type: application/json" \
        -d '{"text":"Test notification from GitLumen"}' \
        YOUR_TEAMS_WEBHOOK_URL
   ```

2. **Verify in Teams**
   - Check your Teams channel for the test message
   - Verify formatting and appearance

## Notification Types

### Merge Request Notifications

GitLumen sends different notifications based on merge request events:

| Event | Notification Type | Content |
|-------|------------------|---------|
| **Created** | New MR | MR title, author, description, labels |
| **Updated** | MR Update | Changes, new commits, updated description |
| **Merged** | MR Merged | Merge time, final commit count, duration |
| **Closed** | MR Closed | Close reason, final status |

### Example Merge Request Card

```json
{
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "text": "🔄 Merge Request Updated",
      "weight": "Bolder",
      "size": "Large"
    },
    {
      "type": "TextBlock",
      "text": "**Project:** frontend-app",
      "spacing": "Small"
    },
    {
      "type": "TextBlock",
      "text": "**Title:** Add user authentication",
      "spacing": "Small"
    },
    {
      "type": "TextBlock",
      "text": "**Author:** @john.doe",
      "spacing": "Small"
    },
    {
      "type": "TextBlock",
      "text": "**Status:** Open",
      "spacing": "Small"
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "View MR",
      "url": "https://gitlab.com/project/merge_requests/123"
    }
  ]
}
```

## Configuration Options

### Notification Filters

Control which events trigger notifications:

```typescript
// Example: Only notify on important events
const teamsConfig = {
  events: {
    merge_request: {
      created: true,
      updated: false, // Don't notify on every update
      merged: true,
      closed: true,
    },
    push: false, // Don't notify on every push
    tag: true,   // Notify on releases
  },
  filters: {
    branches: ['main', 'develop'], // Only specific branches
    labels: ['urgent', 'bug'],     // Only specific labels
    users: ['@team-leads'],        // Only specific users
  },
};
```

### Channel Routing

Send different notifications to different channels:

```typescript
// Route by project or event type
const channelRouting = {
  'frontend-app': 'teams-webhook-frontend',
  'backend-api': 'teams-webhook-backend',
  'urgent-bugs': 'teams-webhook-alerts',
  'releases': 'teams-webhook-releases',
};
```

### Message Templates

Customize notification appearance:

```typescript
// Custom template for merge requests
const mrTemplate = {
  title: "🔄 {project} - {action}",
  subtitle: "by {author}",
  body: [
    "**Title:** {title}",
    "**Branch:** {source} → {target}",
    "**Labels:** {labels}",
    "**Description:** {description}",
  ],
  actions: [
    { title: "View MR", url: "{mr_url}" },
    { title: "Review", url: "{review_url}" },
  ],
};
```

## Advanced Features

### Adaptive Cards

Use Microsoft's Adaptive Cards for rich formatting:

```typescript
// Create adaptive card
const card = {
  type: "AdaptiveCard",
  version: "1.3",
  body: [
    {
      type: "TextBlock",
      text: "🚀 New Release Deployed",
      weight: "Bolder",
      size: "Large",
      color: "Good"
    },
    {
      type: "FactSet",
      facts: [
        { title: "Version", value: "v2.1.0" },
        { title: "Environment", value: "Production" },
        { title: "Deployed By", value: "@devops-team" }
      ]
    }
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      title: "View Release Notes",
      url: "https://docs.company.com/releases/v2.1.0"
    }
  ]
};
```

### Interactive Actions

Add buttons and actions to notifications:

```typescript
// Add approval buttons
const approvalCard = {
  actions: [
    {
      type: "Action.Submit",
      title: "✅ Approve",
      data: { action: "approve", mr_id: "123" }
    },
    {
      type: "Action.Submit",
      title: "❌ Reject",
      data: { action: "reject", mr_id: "123" }
    }
  ]
};
```

### Scheduled Notifications

Send notifications at specific times:

```typescript
// Daily summary at 9 AM
const dailySummary = {
  schedule: "0 9 * * *", // Cron expression
  type: "summary",
  include: ["merge_requests", "deployments", "issues"],
  channel: "teams-webhook-daily",
};
```

## Security Best Practices

### Webhook Security
- **Use HTTPS** for all webhook URLs
- **Rotate webhook URLs** regularly
- **Monitor webhook usage** for unusual activity
- **Limit webhook permissions** to specific channels

### Access Control
- **Restrict channel access** to team members only
- **Use private channels** for sensitive notifications
- **Audit notification logs** regularly
- **Implement approval workflows** for critical actions

### Data Privacy
- **Sanitize user data** before sending to Teams
- **Avoid sending sensitive information** in notifications
- **Comply with data protection regulations** (GDPR, etc.)
- **Implement data retention policies**

## Troubleshooting

### Common Issues

**Notifications not appearing in Teams**
```bash
# Check webhook URL is correct
# Verify webhook is enabled in Teams
# Check GitLumen logs for errors
# Test webhook manually with curl
```

**Formatting issues**
```bash
# Verify Adaptive Card syntax
# Check Teams supports the card version
# Test with simple text first
# Review Teams documentation for limitations
```

**Duplicate notifications**
```bash
# Check webhook configuration
# Verify event filtering is working
# Check for multiple webhook URLs
# Review notification deduplication logic
```

### Debug Mode

Enable Teams plugin debugging:

```env
# Add to .env
TEAMS_DEBUG=true
LOG_LEVEL=debug
```

### Testing Locally

Test Teams integration during development:

```bash
# Use ngrok to expose local API
ngrok http 3001

# Update Teams webhook to use ngrok URL
# Test notifications from local development
```

## Integration Examples

### GitLab CI/CD Integration

Send deployment notifications to Teams:

```yaml
# .gitlab-ci.yml
deploy:
  script:
    - echo "Deploying to production..."
  after_script:
    - curl -X POST "https://gitlumen-api.com/api/v1/notifications/teams" \
        -H "Content-Type: application/json" \
        -d '{"type":"deployment","status":"success","project":"$CI_PROJECT_NAME"}'
```

### Slack to Teams Migration

Migrate from Slack to Teams:

```typescript
// Migration helper
const migrateNotifications = async (slackConfig, teamsConfig) => {
  // Map Slack channels to Teams channels
  const channelMapping = {
    '#general': teamsConfig.generalChannel,
    '#dev-team': teamsConfig.devChannel,
    '#alerts': teamsConfig.alertsChannel,
  };
  
  // Update notification routing
  await updateNotificationRouting(channelMapping);
};
```

## Next Steps

- [Project Configuration](project-configuration.md)
- [API Reference](../api-reference.md)
- [Custom Templates](custom-templates.md)
- [Troubleshooting Guide](../troubleshooting.md) 