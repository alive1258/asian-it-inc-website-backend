import { ApiTags } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'home_education' })
@ApiTags('Home Education')
export class HomeEducation {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Short description or tagline shown in the hero section.
   */
  @Column({ type: 'text' })
  faculty_name: string;

  /**
   * Link to the CV or portfolio (optional).
   */
  @Column({ type: 'varchar', length: 500 })
  institute_name?: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  session?: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  result?: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  subject?: string;

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
