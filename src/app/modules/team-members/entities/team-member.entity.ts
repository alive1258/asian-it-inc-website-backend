import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Designation } from '../../designations/entities/designation.entity';

@Entity({ name: 'team_members' })
export class TeamMember {
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
   * Unique slug for the team member (used in URLs)
   */
  @Column({ type: 'varchar', nullable: false })
  slug: string;

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  biography: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  designation_id: string;

  @ManyToOne(() => Designation, {
    nullable: false,
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

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
