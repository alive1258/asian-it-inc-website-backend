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

@Entity({ name: 'work_flow_category' })
export class WorkFlowCategory {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  portfolio_id: string;

  @ManyToOne(() => Portfolio, {
    nullable: false,
  })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  /**
   * User ID of the person who added the team member
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp of when the record was created
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp of the last update to the record
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
