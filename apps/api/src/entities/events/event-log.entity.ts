import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { EventLogData, JsonObject, MetadataObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from '../organizations';
import { Project } from '../projects';
import { ProviderConfig } from '../providers';

@Entity('event_logs')
@Index(['projectId', 'createdAt'])
@Index(['status', 'createdAt'])
export class EventLog extends BaseEntity implements EventLogData {
  @Column({ length: 100 })
  @Index()
  eventType!: string; // 'merge_request.opened', 'merge_request.updated', etc.

  @Column({ length: 255, nullable: true })
  @Index()
  eventSourceId?: string; // MR IID, PR number, etc.

  @Column({ length: 255, nullable: true })
  authorExternalId?: string; // Who triggered the event

  @Column({ type: 'jsonb' })
  eventData!: JsonObject; // Full webhook payload

  @Column({ type: 'enum', enum: ['pending', 'processed', 'failed'], default: 'pending' })
  @Index()
  status!: 'pending' | 'processed' | 'failed';

  @Column({ type: 'text', nullable: true })
  error?: string; // Error message if processing failed

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: MetadataObject; // Processing metadata, notifications sent, etc.

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, project => project.eventLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column({ type: 'uuid' })
  providerConfigId!: string;

  @ManyToOne(() => ProviderConfig, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'providerConfigId' })
  providerConfig!: ProviderConfig;
}
