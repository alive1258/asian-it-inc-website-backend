import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Faq } from '../../faqs/entities/faq.entity';

@Entity({ name: 'faq_ans' })
export class FaqAn {
  /**
   * primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * question
   */
  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  question: string;
  /**
   * answer
   */
  @Column({
    type: 'varchar',
    nullable: false,
    length: 1024,
  })
  answer: string;

  /**
   * Relation with faq id
   */
  @Column({ type: 'bigint' })
  faq_id: string;

  @ManyToOne(() => Faq, {
    nullable: false,
  })
  @JoinColumn({ name: 'faq_id' })
  faq: Faq;

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
