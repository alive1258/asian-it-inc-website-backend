import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'work_process' })
export class WorkProcess {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * Unique slug for the team member (used in URLs)
   */
  @Column({ type: 'varchar', nullable: false })
  description: string;

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  color_code: string;

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
