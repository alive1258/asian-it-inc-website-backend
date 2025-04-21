import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Testimonial Entity
 * Represents a customer's testimonial with their personal information, review, and feedback.
 */
@Entity({ name: 'testimonials' })
export class Testimonial {
  /**
   * Primary Key: Auto-incrementing ID
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Customer Name
   * Max length: 128 characters
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  /**
   * Customer Photo (URL or filename)
   * Optional field: can be null if not provided
   */
  @Column({
    type: 'varchar',
    nullable: true, // Made optional (can be null)
  })
  photo: string;

  /**
   * Customer Review Rating (e.g., numeric rating)
   */
  @Column({
    type: 'int', // Changed to 'int' for numeric values, which is more suitable for ratings
    nullable: false,
  })
  review: number;

  /**
   * Customer Designation (e.g., Manager, CEO, etc.)
   * Max length: 128 characters
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  designation: string;

  /**
   * Customer's Testimonial Message
   * Max length: 1024 characters
   */
  @Column({
    type: 'varchar',
    nullable: false,
    // Increased length to accommodate longer messages
  })
  message: string;

  /**
   * User Id
   */
  @Column({ type: 'bigint' })
  added_by: string;
  /**
   * Date of creation
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Date of last update
   */
  @UpdateDateColumn()
  updated_at: Date;
}
