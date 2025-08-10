import { Entity, Column, Index } from 'typeorm';
import { WebhookDeliveryData, HttpHeaders, JsonObject } from '@gitlumen/core';
import { BaseEntity } from '../base.entity';

@Entity('webhook_deliveries')
@Index(['projectId', 'createdAt'])
export class WebhookDelivery extends BaseEntity implements WebhookDeliveryData {
  @Column({ type: 'uuid' })
  @Index()
  projectId!: string;

  @Column({ type: 'uuid', nullable: true })
  eventLogId?: string; // Link to processed event

  @Column({ length: 500 })
  webhookUrl!: string;

  @Column({ type: 'jsonb' })
  headers!: HttpHeaders;

  @Column({ type: 'jsonb' })
  payload!: JsonObject;

  @Column({ type: 'integer', nullable: true })
  responseStatus?: number;

  @Column({ type: 'jsonb', nullable: true })
  responseHeaders?: HttpHeaders;

  @Column({ type: 'text', nullable: true })
  responseBody?: string;

  @Column({ type: 'integer' })
  duration!: number; // milliseconds

  @Column({ type: 'boolean', default: false })
  isValid!: boolean; // Signature validation result
}