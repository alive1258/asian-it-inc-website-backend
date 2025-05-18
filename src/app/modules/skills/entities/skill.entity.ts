import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SkillsCategory } from '../../skills-category/entities/skills-category.entity';

@Entity({ name: 'skills' })
export class Skill {
  /**
   * primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * skill_title
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  skill_title?: string;

  /**
   * skill_amount
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  skill_amount?: string;

  /**
   * relation with snapshot category
   */
  @Column({ type: 'bigint', nullable: false })
  skills_category_id: string;

  @ManyToOne(() => SkillsCategory, {
    nullable: false,
  })
  @JoinColumn({
    name: 'skills_category_id',
  })
  skillsCategory: SkillsCategory;

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
