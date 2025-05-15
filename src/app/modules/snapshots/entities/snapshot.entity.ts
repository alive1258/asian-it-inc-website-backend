import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SnapshotsCategory } from '../../snapshots-category/entities/snapshots-category.entity';

@Entity({ name: 'snapshots' })
export class Snapshot {
  /**
   * primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * photos
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  photo?: string;

  /**
   * relation with snapshot category
   */
  @Column({ type: 'bigint', nullable: false })
  snapshots_category_id: string;

  @ManyToOne(() => SnapshotsCategory, {
    nullable: false,
  })
  @JoinColumn({
    name: 'snapshots_category_id',
  })
  snapshotsCategory: SnapshotsCategory;

  /**
   * ID of the user who added this record.
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp when the entry was created.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Timestamp when the entry was last updated.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
