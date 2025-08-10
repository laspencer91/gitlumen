import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index, Unique } from 'typeorm';
import { ProjectData, MetadataObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from '../organizations';
import { ProviderConfig } from '../providers';
import { ProjectTeamMember } from './project-team-member.entity';
import { ProjectEventSubscription } from './project-event-subscription.entity';
import { ProjectPluginConfig } from '../plugins';
import { EventLog } from '../events';

@Entity('projects')
@Unique(['organizationId', 'slug'])
export class Project extends BaseEntity implements ProjectData {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  @Index()
  slug!: string; // URL-friendly identifier

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 255 })
  @Index()
  externalId!: string; // GitLab project ID, GitHub repo ID

  @Column({ length: 500 })
  webUrl!: string; // Link to the project in GitLab/GitHub

  @Column({ length: 255, nullable: true })
  defaultBranch?: string;

  @Column({ length: 255, unique: true })
  @Index()
  webhookId!: string; // Unique ID for webhook URL generation

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: MetadataObject; // Additional provider-specific data

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, org => org.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'uuid' })
  providerConfigId!: string;

  @ManyToOne(() => ProviderConfig, provider => provider.projects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'providerConfigId' })
  providerConfig!: ProviderConfig;

  @OneToMany(() => ProjectTeamMember, member => member.project)
  teamMembers!: ProjectTeamMember[];

  @OneToMany(() => ProjectEventSubscription, sub => sub.project)
  eventSubscriptions!: ProjectEventSubscription[];

  @OneToMany(() => ProjectPluginConfig, config => config.project)
  pluginConfigs!: ProjectPluginConfig[];

  @OneToMany(() => EventLog, log => log.project)
  eventLogs!: EventLog[];
}
