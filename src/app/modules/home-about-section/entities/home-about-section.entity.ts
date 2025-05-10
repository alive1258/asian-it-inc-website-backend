import { ApiTags } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'home_about_section' })
@ApiTags('Home About Section')
export class HomeAboutSection {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Short description or tagline shown in the hero section.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Link to the CV or portfolio (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 500 })
  video_link?: string;

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', nullable: true, length: 255 })
  thumbnail_image?: string;

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
