import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';

@Entity({ name: 'service_faq' })
export class ServiceFaq {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Hero section title
   */
  @Column({ type: 'varchar', nullable: false })
  question: string;

  /**
   * Hero section description
   */
  @Column({ type: 'varchar', nullable: false })
  answer: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  service_id: string;

  @ManyToOne(() => Service, {
    nullable: false,
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  /**
   * Timestamp when the record was created
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
