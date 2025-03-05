import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('group_types')
export class GroupType {
  /**
   * Primary Key
   */
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  /**
   * Created At
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Updated At
   */
  @UpdateDateColumn()
  updated_at: Date;
}
