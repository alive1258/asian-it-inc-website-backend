import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('packages')
export class Packages {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  package_type: number;

  @Column({ type: 'decimal' })
  point: number;

  @Column({ type: 'int' })
  family_group: number;

  @Column({ type: 'int' })
  circle_group: number;

  @Column({ type: 'int' })
  family_group_member: number;

  @Column({ type: 'int' })
  circle_group_member: number;

  @Column({ type: 'int' })
  wywtm_member: number;

  @Column({ type: 'int' })
  family_group_total_tracking: number;

  @Column({ type: 'int' })
  circle_group_total_tracking: number;

  @Column({ type: 'int' })
  wywtm_total_tracking: number;

  // Automatically sets the current timestamp when the entity is created
  @CreateDateColumn()
  created_at: Date;

  // Automatically sets the current timestamp when the entity is updated
  @CreateDateColumn()
  updated_at: Date;
}
