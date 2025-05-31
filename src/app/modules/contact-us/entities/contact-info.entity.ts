import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contact_infos')
export class ContactInfo {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Full name' })
  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @ApiProperty({ example: '012541' })
  @Column({ type: 'varchar', length: 20 })
  phone_number: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({ example: 'website development' })
  @Column({ type: 'varchar', length: 100 })
  service_type: string;

  @ApiProperty({ example: 'Enter message' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ example: '1' })
  @Column({ type: 'varchar', length: 5, default: 0 })
  is_read?: string;

  @ApiProperty({ example: '1' })
  @Column({ type: 'varchar', length: 5, default: 0 })
  is_reply?: string;

  @ApiProperty({ example: '2024-09-01T12:00:00.000Z' })
  @CreateDateColumn()
  created_at: Date;
}
