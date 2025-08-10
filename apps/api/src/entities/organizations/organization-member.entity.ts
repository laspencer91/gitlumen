import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { OrganizationMemberData } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';
import { Organization } from './organization.entity';

@Entity('organization_members')
@Unique(['organizationId', 'email'])
export class OrganizationMember extends BaseEntity implements OrganizationMemberData {
  @Column({ length: 255 })
  @Index()
  email!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: ['owner', 'admin', 'member'], default: 'member' })
  role!: 'owner' | 'admin' | 'member';

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  invitedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  // Relations
  @Column({ type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, org => org.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;
}