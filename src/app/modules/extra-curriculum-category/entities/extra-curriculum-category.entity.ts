import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entity representing a category for extra-curricular activities.
 */
@Entity({ name: 'extra_curriculum_categories' })
export class ExtraCurriculumCategory {
  /**
   * Primary key ID (auto-incremented bigint).
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Title of the extra curriculum category (e.g., department or faculty name).
   */
  @Column({ type: 'text' })
  title: string;

  /**
   * ID of the user who added this record.
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the record was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
