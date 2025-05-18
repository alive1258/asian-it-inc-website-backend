import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'collaborating' })
export class Collaborating {
  /**
   * Auto-incremented unique ID of the collaboration record.
   */
  @ApiProperty({ description: 'Primary key ID (auto-incremented bigint)' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Title or name of the collaborating faculty or department.
   */
  @ApiProperty({ description: 'Name of the faculty or department' })
  @Column({ type: 'text', nullable: false })
  title: string;

  /**
   * Email of the collaborating person or institution.
   */
  @ApiProperty({
    description: 'Email address of the collaborating person or institute',
    example: 'contact@buet.edu.bd',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  /**
   * Phone number of the collaborator (optional).
   */
  @ApiProperty({
    description: 'Phone number of the collaborating entity',
    example: '+8801712345678',
    required: false,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  /**
   * Link to the collaborator’s website or LinkedIn profile (optional).
   */
  @ApiProperty({
    description: 'Website or LinkedIn profile link',
    example: 'https://linkedin.com/in/example',
    required: false,
  })
  @Column({ type: 'varchar', length: 500, nullable: false })
  linked_link: string;

  /**
   * Physical location of the collaborating entity (optional).
   */
  @ApiProperty({
    description: 'Location of the collaborating institute or department',
    example: 'Dhaka, Bangladesh',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  location: string;

  /**
   * ID of the user who created the collaboration record.
   */
  @ApiProperty({
    description: 'ID of the user who added this record',
    example: '101',
  })
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the record was created.
   */
  @ApiProperty({
    description: 'Timestamp when the entry was created',
  })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated.
   */
  @ApiProperty({
    description: 'Timestamp when the entry was last updated',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
