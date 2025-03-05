import { Exclude } from 'class-transformer';
import { User } from 'src/app/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OTP {
  /**
   * Primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   *  user id
   */
  @Column({
    type: 'bigint',
    nullable: false,
    unique: true,
  })
  added_by: string;

  // Added by relation
  @OneToOne(() => User)
  @JoinColumn({ name: 'added_by' })
  added_by_user: User;

  /**
   * otp code
   */
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  @Exclude()
  otp_code: string;

  /**
   * attempt
   */
  @Column({
    type: 'int',
    nullable: false,
  })
  attempt: number;

  /**
   * expire at
   */
  @Column({
    type: 'timestamp',
    nullable: false,
  })
  expire_at: Date;

  /**
   * created at
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * updated at
   */
  @UpdateDateColumn()
  updated_at: Date;
}
