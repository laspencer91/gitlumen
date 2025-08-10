import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { ProviderConfigData, MetadataObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from '../organizations';
import { Project } from '../projects';

@Entity('provider_configs')
export class ProviderConfig extends BaseEntity implements ProviderConfigData {
  @Column({ length: 255 })
  name!: string; // "Production GitLab", "GitHub Enterprise", etc.

  @Column({ type: 'enum', enum: ['gitlab', 'github', 'bitbucket'] })
  @Index()
  type!: 'gitlab' | 'github' | 'bitbucket';

  @Column({ length: 500 })
  baseUrl!: string; // https://gitlab.com or self-hosted URL

  @Column({ type: 'text' })
  accessToken!: string; // Encrypted in practice

  @Column({ length: 255, nullable: true })
  webhookSecret?: string; // Global webhook secret for this provider

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: MetadataObject; // API version, capabilities, etc.

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, org => org.providerConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @OneToMany(() => Project, project => project.providerConfig)
  projects!: Project[];
}
