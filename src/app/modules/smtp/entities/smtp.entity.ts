import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('smtp_config')
export class SmtpConfig {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'smtps' })
  mail_driver: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'smtp.gmail.com' })
  mail_host: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 465 })
  mail_port: number;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'your_email@gmail.com' })
  mail_username: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'your_password_or_app_password' })
  mail_password: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'ssl' })
  mail_encryption: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ example: 'Your Company Name' })
  from_name: string;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ example: 1 })
  status: number;

  @Column({ type: 'varchar', default: 1 })
  @ApiProperty({ example: 1 })
  narration?: string;

  @Column({ type: 'bigint', unsigned: true })
  @ApiProperty({ example: 1 })
  added_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
