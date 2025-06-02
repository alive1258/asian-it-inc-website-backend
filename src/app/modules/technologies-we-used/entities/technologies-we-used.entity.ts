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
import { Technology } from '../../system-table/technologies/entities/technology.entity';

@Entity({ name: 'technologies_we_used' })
export class TechnologiesWeUsed {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  technology_name: string;

  /**
   * Profile icon URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  icon?: string;

  /**
   * Foreign key referencing the Service
   */
  @Column({ type: 'bigint' })
  service_id: string;

  @ManyToOne(() => Service, {
    nullable: false,
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
  /**
   * Foreign key referencing the Service
   */
  @Column({ type: 'bigint' })
  technology_id: string;

  @ManyToOne(() => Technology, {
    nullable: false,
  })
  @JoinColumn({ name: 'technology_id' })
  technology: Technology;

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
