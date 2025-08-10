import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { ProjectTeamMemberData, MetadataObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Project } from './project.entity';

@Entity('project_team_members')
@Unique(['projectId', 'externalUserId'])
export class ProjectTeamMember extends BaseEntity implements ProjectTeamMemberData {
  @Column({ length: 255 })
  @Index()
  externalUserId!: string; // GitLab/GitHub user ID

  @Column({ length: 255 })
  @Index()
  username!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'enum', enum: ['developer', 'maintainer', 'owner', 'guest'], nullable: true })
  accessLevel?: 'developer' | 'maintainer' | 'owner' | 'guest';

  @Column({ default: true })
  isTracked!: boolean; // Whether to send notifications for this member

  @Column({ type: 'jsonb', nullable: true })
  metadata!: MetadataObject; // Provider-specific user data

  // Relations
  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, project => project.teamMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;
}