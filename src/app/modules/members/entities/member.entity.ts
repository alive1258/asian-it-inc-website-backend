import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Groups } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint' })
  group_id: number;

  @ManyToOne(() => Groups)
  @JoinColumn({ name: 'group_id' })
  group: Groups;

  @Column({
    type: 'bigint',
    default: 1,
    comment: '1: active, 0: inactive',
  })
  status: number;

  @Column({ type: 'bigint' })
  added_by: number;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'added_by' })
  added_user: User;

  // Automatically sets the current timestamp when the entity is created
  @CreateDateColumn()
  created_at: Date;

  // Automatically sets the current timestamp when the entity is updated
  @CreateDateColumn()
  updated_at: Date;
}
