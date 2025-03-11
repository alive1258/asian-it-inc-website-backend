import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { GroupType } from '../../group-types/entities/group-type.entity';

@Entity('groups')
export class Groups {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'bigint' })
  group_type_id: number;

  @ManyToOne(() => GroupType)
  @JoinColumn({ name: 'group_type_id' })
  group_type: GroupType;

  @Column({ type: 'time' })
  check_in_time: Date;

  @Column({ type: 'time' })
  check_out_time: Date;

  @Column({ type: 'bigint' })
  added_by: number;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'added_by' })
  user: User;

  // Automatically sets the current timestamp when the entity is created
  @CreateDateColumn()
  created_at: Date;

  // Automatically sets the current timestamp when the entity is updated
  @UpdateDateColumn()
  updated_at: Date;
}
