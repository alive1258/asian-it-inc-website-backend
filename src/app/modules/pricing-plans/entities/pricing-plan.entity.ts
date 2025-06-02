import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { PlanType } from '../../system-table/plan-types/entities/plan-type.entity';

@Entity({ name: 'pricing_plan' })
export class PricingPlan {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Plan headline or title
   */
  @Column({ type: 'varchar', nullable: false })
  headline: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  regular_price: number;

  /**
   * Indicates whether the plan is monthly or not
   */
  @Column({ type: 'boolean', nullable: false, default: true })
  is_monthly: boolean;

  /**
   * Foreign key referencing the service this plan belongs to
   */
  @Column({ type: 'bigint' })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * Foreign key referencing the plan type
   */
  @Column({ type: 'bigint' })
  plan_type_id: string;

  @ManyToOne(() => PlanType, { nullable: false })
  @JoinColumn({ name: 'plan_type_id' })
  planType: PlanType;

  /**
   * ID of the user who added this plan
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  /**
   * Timestamp when the record was created
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
