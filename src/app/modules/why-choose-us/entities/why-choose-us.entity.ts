// why-choose.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('why_choose')
export class WhyChoose {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty({ example: '10+ Years of Experience' })
  title: string;

  @Column('text')
  @ApiProperty({ example: 'We prioritize customer needs, providing tailor-made solutions and transparent communication.' })
  description: string;

  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
