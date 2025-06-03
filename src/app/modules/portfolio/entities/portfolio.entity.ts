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

@Entity({ name: 'portfolio' })
export class Portfolio {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Project or plan name
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  slug: string;

  /**
   * Duration of the project (e.g., "3 months")
   */
  @Column({ type: 'varchar', nullable: false })
  duration: string;

  /**
   * Short description of the portfolio project
   */
  @Column({ type: 'varchar', nullable: false })
  description: string;

  /**
   * Name of the company associated with the project
   */
  @Column({ type: 'varchar', nullable: false })
  company_name: string;

  /**
   * Logo of the company (image URL or filename)
   */
  @Column({ type: 'varchar', nullable: true })
  company_logo?: string;

  /**
   * Thumbnail image of the project
   */
  @Column({ type: 'varchar', nullable: true })
  thumbnail?: string;

  /**
   * Banner image of the project
   */
  @Column({ type: 'varchar', nullable: true })
  banner?: string;

  /**
   * Foreign key referencing the service this portfolio belongs to
   */
  @Column({ type: 'bigint' })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * ID of the user who added this portfolio entry
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
