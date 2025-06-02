import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../system-table/clients/entities/client.entity';
import { Designation } from '../../designations/entities/designation.entity';
import { Service } from '../../services/entities/service.entity';

/**
 * Testimonial Entity
 * Represents a customer's testimonial with associated client, service, and designation.
 */
@Entity({ name: 'testimonials' })
export class Testimonial {
  /**
   * Primary Key: Auto-incrementing ID
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Foreign Key - Client ID
   */
  @Column({ type: 'bigint' })
  client_id: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  /**
   * Foreign Key - Service ID
   */
  @Column({ type: 'bigint' })
  service_id: string;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  /**
   * Foreign Key - Designation ID
   */
  @Column({ type: 'bigint' })
  designation_id: string;

  @ManyToOne(() => Designation, { nullable: false })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  /**
   * Customer review comments
   */
  @Column({ type: 'varchar', nullable: false })
  comments: string;

  /**
   * Customer review rating (e.g., 1–5)
   */
  @Column({ type: 'int', nullable: false })
  review: number;

  /**
   * ID of the user who added this testimonial
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the testimonial was created
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Timestamp when the testimonial was last updated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
