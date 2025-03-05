import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('points')
export class Points {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'int' })
  geofenceId: number;

  @Column({ type: 'varchar', length: 30 })
  latitude: string;

  @Column({ type: 'varchar', length: 30 })
  longitude: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
