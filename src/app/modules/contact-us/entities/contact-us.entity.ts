// why-choose.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contact-us')
export class ContactUs {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ example: '+0121471457' })
  phone_number: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ example: 'example@gmail.com' })
  email_address: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    example: '123 Creative Street, New York, USA 123'
  })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'https://facebook.com/username'
  })
  facebook_url: string;


  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'https://facebook.com/username'
  })
  instagram_url: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'https://facebook.com/username'
  })
  linkedin_url: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'https://facebook.com/username'
  })
  x_url: string;


  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'https://facebook.com/username'
  })
  web_url: string;

  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
