import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ProjectPluginConfigData, ConfigObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Project } from '../projects';
import { PluginConfig } from './plugin-config.entity';

@Entity('project_plugin_configs')
@Unique(['projectId', 'pluginConfigId'])
export class ProjectPluginConfig extends BaseEntity implements ProjectPluginConfigData {
  @Column({ default: true })
  isEnabled!: boolean;

  @Column({ type: 'jsonb' })
  config!: ConfigObject; // Project-specific overrides (e.g., specific Teams channel)

  // Relations
  @Column({ type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, project => project.pluginConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column({ type: 'uuid' })
  pluginConfigId!: string;

  @ManyToOne(() => PluginConfig, plugin => plugin.projectConfigs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pluginConfigId' })
  pluginConfig!: PluginConfig;
}
