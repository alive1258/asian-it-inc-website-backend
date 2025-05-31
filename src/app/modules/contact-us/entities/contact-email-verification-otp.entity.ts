import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact_email_verification_otps')
export class ContactEmailVerificationOtp {
  /**
   * Primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   *  user id
   */
  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  /**
   * otp code
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  @Exclude()
  otp_code: string;

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
