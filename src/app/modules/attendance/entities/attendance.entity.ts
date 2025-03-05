import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attendance')
export class Attendance {
  /**
   * Primary Key
   */
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  /**
   * Geofence Id
   */
  @Column({ type: 'int' })
  geofence_id: number;

  /**
   * Employee Id
   */
  @Column({ type: 'int' })
  employee_id: number;

  /**
   * Enter Time
   */
  @Column({ type: 'time' })
  enter_time: string;

  /**
   * Exit Time
   */
  @Column({ type: 'time' })
  exit_time: string;

  /**
   * Notification Type
   */
  @Column({ type: 'int', default: 0 }) // Change type to integer
  notification_type: number; // or change to boolean based on your requirement

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
