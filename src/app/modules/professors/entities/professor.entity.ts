import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'professors' })
export class Professor {
  /**
   * Primary key ID (auto-incremented bigint).
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Full name of the professor.
   */
  @Column({ type: 'text' })
  professor_name: string;

  /**
   * Short description or tagline shown in the profile.
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Professional title (e.g., Associate Professor).
   */
  @Column({ type: 'text' })
  title: string;

  /**
   * Name of the institute.
   */
  @Column({ type: 'text' })
  institute: string;

  /**
   * Name of the department.
   */
  @Column({ type: 'text' })
  department: string;

  /**
   * List of research subject titles.
   * Stored as a PostgreSQL text array.
   */
  @Column({ type: 'text', array: true })
  research_subject_title: string[];

  /**
   * Photo filename or image URL (optional).
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  photo?: string;

  /**
   * ID of the user who added this professor.
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the record was created.
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
