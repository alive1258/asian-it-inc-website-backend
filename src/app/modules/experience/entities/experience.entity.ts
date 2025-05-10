import { ApiTags } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'experience' })
@ApiTags('Experience')
export class Experience {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Name of the faculty or department.
   */
  @Column({ type: 'varchar', length: 255 })
  faculty_name: string;

  /**
   * Name of the institute or organization.
   */
  @Column({ type: 'varchar', length: 500 })
  institute_name: string;

  /**
   * Session or timeline of the experience.
   */
  @Column({ type: 'varchar', length: 100 })
  session: string;

  /**
   * Position held during the experience.
   */
  @Column({ type: 'varchar', length: 255 })
  position: string;

  /**
   * Major subject or area of focus.
   */
  @Column({ type: 'varchar', length: 255 })
  subject: string;

  /**
   * Duration of the experience.
   */
  @Column({ type: 'varchar', length: 100 })
  duration: string;

  /**
   * Title or heading for the experience.
   */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * Detailed description of the role and responsibilities.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Skills gained or used during the experience.
   * Stored as a comma-separated string.
   */
  @Column('text', { array: true })
  skills: string[];

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 255 })
  photo?: string;

  /**
   * Link to certificate or external proof (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 1000 })
  certificate_link?: string;

  /**
   * ID of the user who added this record.
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the entry was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the entry was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
