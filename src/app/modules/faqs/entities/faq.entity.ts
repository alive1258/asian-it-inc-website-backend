import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'faqs' })
export class Faq {
  /**
   * Primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * headline
   */
  @Column({
    type: 'varchar',
    nullable: false,
    length: 128,
  })
  headline: string;

  /**
   * photos
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  photo: string;

  /**
   * User Id
   */
  @Column({ type: 'bigint' })
  added_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
