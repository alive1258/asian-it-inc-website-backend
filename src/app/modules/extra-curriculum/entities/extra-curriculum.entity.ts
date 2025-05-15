import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExtraCurriculumCategory } from '../../extra-curriculum-category/entities/extra-curriculum-category.entity';

@Entity({ name: 'extra_curriculum' })
export class ExtraCurriculum {
  /**
   * Primary key (Auto-incremented big integer).
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Title or name of the extra curriculum activity.
   */
  @Column({ type: 'text' })
  title: string;

  /**
   * Institute name where the activity was held.
   */
  @Column({ type: 'text' })
  institute: string;

  /**
   * Organization responsible for the activity.
   */
  @Column({ type: 'text' })
  organization: string;

  /**
   * Description or result of the activity.
   */
  @Column({ type: 'text' })
  data: string;

  /**
   * Optional photo or certificate related to the activity.
   */
  @Column({ type: 'varchar', nullable: true })
  photo?: string;

  /**
   * Foreign key for the ExtraCurriculumCategory.
   */
  @Column({ type: 'bigint' })
  extra_curriculum_categories_id: string;

  /**
   * Many-to-One relation with ExtraCurriculumCategory.
   */
  @ManyToOne(() => ExtraCurriculumCategory, {
    nullable: false,
  })
  @JoinColumn({ name: 'extra_curriculum_categories_id' })
  extraCurriculumCategory: ExtraCurriculumCategory;

  /**
   * User ID who added this curriculum entry.
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
