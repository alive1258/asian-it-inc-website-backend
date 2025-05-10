import { ApiTags } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'home_hero_section' })
@ApiTags('Home Hero Section')
export class HomeHeroSection {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the individual shown in the hero section.
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Educational class or title designation.
   */
  @Column({ type: 'varchar', length: 255 })
  class_name: string;

  /**
   * Name of the course the person is enrolled in or representing.
   */
  @Column({ type: 'varchar', length: 255 })
  course_name: string;

  /**
   * Short description or tagline shown in the hero section.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Link to the CV or portfolio (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 500 })
  cv_link?: string;

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 255 })
  photo?: string;

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
