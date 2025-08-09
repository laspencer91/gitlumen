# GitLab Integration Setup 🔗

Learn how to connect GitLumen with your GitLab instance to monitor merge requests and development activity.

## Overview

GitLumen integrates with GitLab through:
- **Webhooks** - Real-time notifications for merge request events
- **API Access** - Fetch project data and user information
- **Authentication** - Personal access tokens for secure access

## Prerequisites

- GitLab instance (self-hosted or GitLab.com)
- Admin access to your GitLab project/group
- Personal access token with appropriate permissions

## Step 1: Create GitLab Personal Access Token

1. **Go to GitLab User Settings**
   - Navigate to your GitLab instance
   - Click on your profile picture → **Preferences**
   - Select **Access Tokens** from the left sidebar

2. **Create New Token**
   - **Token name**: `gitlumen-integration`
   - **Expiration date**: Choose appropriate date (recommend 1 year)
   - **Scopes**: Select the following permissions:
     - ✅ `read_api` - Read project data
     - ✅ `read_user` - Read user information
     - ✅ `read_repository` - Read repository data
     - ✅ `read_registry` - Read container registry (if needed)

3. **Generate Token**
   - Click **Create personal access token**
   - **Copy the token** - You won't be able to see it again!

## Step 2: Configure Webhook

1. **Navigate to Project Settings**
   - Go to your GitLab project
   - Click **Settings** → **Webhooks**

2. **Add New Webhook**
   - **URL**: `https://your-gitlumen-domain.com/api/v1/webhooks/gitlab`
   - **Secret Token**: Generate a secure token (you'll add this to GitLumen)
   - **Trigger**: Select the following events:
     - ✅ **Merge request events**
     - ✅ **Push events**
     - ✅ **Tag push events**
     - ✅ **Issue events** (optional)

3. **Advanced Settings**
   - **SSL verification**: Enable for production, disable for development
   - **Enable webhook**: Check this box

4. **Test Webhook**
   - Click **Test** → **Push events**
   - Verify you receive a successful response

## Step 3: Configure GitLumen

1. **Add GitLab Provider Configuration**
   ```bash
   # Generate webhook secret
   node scripts/generate-api-key.js
   ```

2. **Update Environment Variables**
   ```env
   # GitLab Configuration
   GITLAB_URL=https://gitlab.com  # or your self-hosted instance
   GITLAB_ACCESS_TOKEN=your-personal-access-token
   GITLAB_WEBHOOK_SECRET=your-webhook-secret
   ```

3. **Create Project in GitLumen**
   - Open GitLumen web interface
   - Navigate to **Projects** → **Add New Project**
   - Enter your GitLab project details:
     - **Project Name**: Your GitLab project name
     - **GitLab Project ID**: Found in project settings
     - **Webhook URL**: The webhook URL you configured
     - **Access Token**: Your GitLab personal access token

## Step 4: Verify Integration

1. **Test Webhook Reception**
   - Make a change in your GitLab project
   - Create a merge request or push code
   - Check GitLumen logs for webhook reception

2. **Check Data Sync**
   - Navigate to your project in GitLumen
   - Verify merge requests are being tracked
   - Check that user information is syncing

## Configuration Options

### Webhook Events

GitLumen processes the following GitLab webhook events:

| Event | Description | Action |
|-------|-------------|---------|
| `Merge Request Hook` | MR created, updated, merged, closed | Update MR status, notify team |
| `Push Hook` | Code pushed to repository | Track development activity |
| `Tag Push Hook` | New tag created | Track releases |
| `Issue Hook` | Issue created, updated, closed | Track project management |

### Filtering Options

Configure which events trigger notifications:

```typescript
// Example: Only notify on MR events
const webhookConfig = {
  events: ['merge_request'],
  branches: ['main', 'develop'], // Only specific branches
  users: ['@team-leads'], // Only specific users
};
```

## Security Considerations

### Access Token Security
- **Never commit tokens** to version control
- **Use environment variables** for all sensitive data
- **Rotate tokens regularly** (recommended: every 90 days)
- **Limit token scope** to minimum required permissions

### Webhook Security
- **Use HTTPS** for all webhook URLs in production
- **Validate webhook signatures** (GitLumen does this automatically)
- **Rate limit webhook endpoints** to prevent abuse
- **Monitor webhook logs** for suspicious activity

### Network Security
- **Firewall rules** - Only allow GitLab → GitLumen traffic
- **VPN access** - Use VPN for self-hosted GitLab instances
- **IP whitelisting** - Restrict access to known GitLab IPs

## Troubleshooting

### Common Issues

**Webhook not receiving events**
```bash
# Check webhook configuration
# Verify URL is accessible from GitLab
# Check GitLumen logs for errors
# Test webhook manually from GitLab
```

**Authentication errors**
```bash
# Verify access token has correct permissions
# Check token hasn't expired
# Ensure token is properly set in environment
```

**Missing merge request data**
```bash
# Verify webhook events are enabled
# Check project ID is correct
# Ensure user has access to project
```

### Debug Mode

Enable debug logging in GitLumen:

```env
# Add to .env
LOG_LEVEL=debug
GITLAB_DEBUG=true
```

### Testing Webhooks Locally

Use ngrok for local development:

```bash
# Install ngrok
npm install -g ngrok

# Start GitLumen API
yarn workspace @gitlumen/api start:dev

# In another terminal, expose local API
ngrok http 3001

# Use the ngrok URL in your GitLab webhook
# Example: https://abc123.ngrok.io/api/v1/webhooks/gitlab
```

## Advanced Configuration

### Multiple GitLab Instances

GitLumen supports multiple GitLab instances:

```typescript
// Configure multiple providers
const providers = [
  {
    name: 'gitlab-com',
    url: 'https://gitlab.com',
    token: process.env.GITLAB_COM_TOKEN,
  },
  {
    name: 'gitlab-enterprise',
    url: 'https://gitlab.company.com',
    token: process.env.GITLAB_ENTERPRISE_TOKEN,
  },
];
```

### Custom Event Processing

Extend webhook processing for custom needs:

```typescript
// Custom event handler
@WebhookHandler('custom_event')
async handleCustomEvent(payload: any) {
  // Process custom event
  await this.notificationService.sendCustomNotification(payload);
}
```

## Next Steps

- [Teams Notification Setup](teams-setup.md)
- [Project Configuration](project-configuration.md)
- [API Reference](../api-reference.md)
- [Troubleshooting Guide](../troubleshooting.md) 