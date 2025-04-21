import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
