import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ProjectEventSubscriptionData, JsonObject } from '@gitlumen/core';
import { Project } from './project.entity';
import { BaseEntity } from '../base.entity';

@Entity('project_event_subscriptions')
@Unique(['projectId', 'eventType'])
export class ProjectEventSubscription extends BaseEntity implements ProjectEventSubscriptionData {
  @Column({ length: 100 })
  eventType!: string; // 'merge_request.opened', 'merge_request.merged', etc.

  @Column({ default: true })
  isEnabled!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  filters!: JsonObject; // Additional filtering rules

  // Relations
  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, project => project.eventSubscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;
}
