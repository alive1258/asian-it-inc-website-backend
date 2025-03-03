import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  /**
   * Primary key
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Name
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  /**
   * Mobile
   */
  @Column({ type: 'varchar', length: 15, nullable: true })
  mobile?: string;

  /**
   * Email
   */
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  /**
   * Email Verified At
   */
  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  /**
   * Is Verified
   */
  @Column({
    type: 'boolean',
    default: false,
  })
  is_verified?: boolean;

  /**
   * Password
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  password: string;
  /**
   * Remember Token
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  remember_token?: string;

  /**
   * Created At
   */
  @Column({ type: 'timestamp', nullable: true })
  created_at?: Date;

  /**
   * Updated At
   */
  @Column({ type: 'timestamp', nullable: true })
  updated_at?: Date;
}
