import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BlogCategory } from '../../blog-categories/entities/blog-category.entity';
import { TeamMember } from '../../team-members/entities/team-member.entity';

@Entity({ name: 'blogs' })
export class Blog {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  blog_title: string;

  /**
   * Unique slug for the team member (used in URLs)
   */
  @Column({ type: 'varchar', nullable: false })
  slug: string;

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  thumbnail?: string;

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  blog_description: string;
  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  blog_tags: string;
  /**
   * Short biography or description
   */
  @Column({ type: 'int', nullable: false })
  reading_time: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  blog_category_id: string;

  @ManyToOne(() => BlogCategory, {
    nullable: false,
  })
  @JoinColumn({ name: 'blog_category_id' })
  blogCategory: BlogCategory;

  @Column({ type: 'bigint' })
  team_member_id: string;

  @ManyToOne(() => TeamMember, {
    nullable: false,
  })
  @JoinColumn({ name: 'team_member_id' })
  teamMember: TeamMember;

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
