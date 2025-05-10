import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';

/**
 * Entity representing a hobby or featured personal interest,
 * typically shown in a portfolio or hero section.
 */
@Entity({ name: 'my_hobbies' }) // Use snake_case for consistency with SQL naming conventions
@ApiTags('My Hobbies') // Groups this entity under "My Hobbies" in Swagger docs
export class MyHobby {
  /**
   * Unique identifier for the hobby entry.
   */
  @ApiProperty({
    description: 'Primary identifier of the hobby record.',
    example: '1',
  })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Title or full name displayed in the hero section.
   */
  @ApiProperty({
    description: 'Full name or title displayed in the hero section.',
    example: 'Sayem Ahmed',
  })
  @Column({ type: 'varchar', length: 355 })
  title: string;

  /**
   * A short tagline or description associated with the hobby.
   */
  @ApiProperty({
    description: 'Short description or tagline.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @Column({ type: 'text' })
  description: string;

  /**
   * Optional image filename or external URL representing the hobby visually.
   */
  @ApiPropertyOptional({
    description: 'Photo filename or image URL (optional).',
    example: 'sayem-profile.jpg',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  photo?: string;

  /**
   * ID of the user who created the hobby entry.
   */
  @ApiProperty({
    description: 'User ID who added the hobby entry.',
    example: '1001',
  })
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp of when the hobby record was created.
   */
  @ApiProperty({
    description: 'Record creation timestamp.',
    example: '2024-09-10T10:30:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp of the last update made to the record.
   */
  @ApiProperty({
    description: 'Record last update timestamp.',
    example: '2024-09-10T12:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
