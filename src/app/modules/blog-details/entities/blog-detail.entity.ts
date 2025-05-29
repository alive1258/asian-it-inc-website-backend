import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Blog } from '../../blogs/entities/blog.entity';

@Entity({ name: 'blog_details' })
export class BlogDetail {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the team member
   */
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * Unique slug for the team member (used in URLs)
   */
  @Column({ type: 'varchar', array: true, nullable: false })
  points: string[];

  /**
   * Profile photo URL (optional)
   */
  @Column({ type: 'varchar', nullable: true, array: true })
  photo?: string[];

  /**
   * Short biography or description
   */
  @Column({ type: 'varchar', nullable: false })
  description: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  blog_id: string;

  @ManyToOne(() => Blog, {
    nullable: false,
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

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
