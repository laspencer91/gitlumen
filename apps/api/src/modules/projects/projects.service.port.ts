/**
 * Projects Service Port
 *
 * Purpose: Manages GitLab/GitHub project configurations and monitoring settings.
 *
 * Description: Connect repositories, configure tracked events, manage project-specific
 * settings, and test provider connections. Each project represents a single repository
 * being monitored for merge request (and related) activity.
 *
 * Key Responsibilities:
 * - Connect to Git providers and store project configs
 * - Configure webhook URLs and secrets
 * - Manage which events to monitor
 * - Store notification settings per project
 * - Sync/manage team member lists
 * - Test provider connections
 */
export abstract class ProjectsServicePort {
  abstract create(dto: any): Promise<any>;
  abstract findAll(query: any): Promise<{ items: any[]; total: number }>;
  abstract testConnection(id: string): Promise<{ id: string; ok: boolean }>;
}

