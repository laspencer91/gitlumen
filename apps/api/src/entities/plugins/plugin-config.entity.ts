import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { PluginConfigData, ConfigObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from '../organizations';
import { ProjectPluginConfig } from './project-plugin-config.entity';

@Entity('plugin_configs')
export class PluginConfig extends BaseEntity implements PluginConfigData {
  @Column({ length: 255 })
  name!: string; // "Teams Notifications", "Slack - Engineering", etc.

  @Column({ length: 100 })
  @Index()
  type!: string; // 'teams', 'slack', 'discord', etc.

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb' })
  config!: ConfigObject; // Plugin-specific global config

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, org => org.pluginConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @OneToMany(() => ProjectPluginConfig, config => config.pluginConfig)
  projectConfigs!: ProjectPluginConfig[];
}
