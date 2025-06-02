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
import { PricingPlan } from '../../pricing-plans/entities/pricing-plan.entity';

@Entity({ name: 'pricing_plan_feature' })
export class PricingPlanFeature {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Plan headline or title
   */
  @Column({ type: 'varchar', nullable: false })
  benefit: string;

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
  pricing_plan_id: string;

  @ManyToOne(() => PricingPlan, { nullable: false })
  @JoinColumn({ name: 'pricing_plan_id' })
  pricingPlan: PricingPlan;

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
