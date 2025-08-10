import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiKeyData } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from '../organizations';

@Entity('api_keys')
export class ApiKey extends BaseEntity implements ApiKeyData {
  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  @Index()
  keyHash!: string; // SHA-256 hash of the actual key

  @Column({ length: 6 })
  keyPrefix!: string; // First 6 chars for identification (e.g., "glm_Xy...")

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  permissions!: string[]; // ['projects:read', 'projects:write', etc.]

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, org => org.apiKeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;
}
