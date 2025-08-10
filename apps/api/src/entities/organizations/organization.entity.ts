import { Entity, Column, OneToMany, Index } from 'typeorm';
import { OrganizationData, JsonObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { ApiKey } from '../auth';
import { Project } from '../projects';
import { OrganizationMember } from './organization-member.entity';
import { ProviderConfig } from '../providers';
import { PluginConfig } from '../plugins';

@Entity('organizations')
export class Organization extends BaseEntity implements OrganizationData {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  @Index()
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings!: JsonObject;

  // Relations
  @OneToMany(() => ApiKey, apiKey => apiKey.organization)
  apiKeys!: ApiKey[];

  @OneToMany(() => Project, project => project.organization)
  projects!: Project[];

  @OneToMany(() => OrganizationMember, member => member.organization)
  members!: OrganizationMember[];

  @OneToMany(() => ProviderConfig, provider => provider.organization)
  providerConfigs!: ProviderConfig[];

  @OneToMany(() => PluginConfig, plugin => plugin.organization)
  pluginConfigs!: PluginConfig[];
}
