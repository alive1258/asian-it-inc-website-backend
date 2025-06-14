import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { WorkFlowCategory } from '../../work-flow-category/entities/work-flow-category.entity';

@Entity({ name: 'work_flow_tool' })
export class WorkFlowTool {
  /**
   * Primary Key - Unique identifier for each workflow detail record
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  /**
   * Foreign key referencing the portfolio associated with this workflow detail
   */
  @Column({ type: 'bigint' })
  portfolio_id: string;

  /**
   * Relationship with Portfolio entity
   */
  @ManyToOne(() => Portfolio, { nullable: false })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  /**
   * Foreign key referencing the workflow category associated with this detail
   */
  @Column({ type: 'bigint' })
  work_flow_category_id: string;

  /**
   * Relationship with WorkFlowCategory entity
   */
  @ManyToOne(() => WorkFlowCategory, { nullable: false })
  @JoinColumn({ name: 'work_flow_category_id' })
  workFlowCategory: WorkFlowCategory;

  /**
   * ID of the user who added this workflow detail
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the workflow detail record was created
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp when the workflow detail record was last updated
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
