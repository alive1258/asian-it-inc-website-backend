import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class Client {
  /**
   * Primary key id
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Name
   */
  @Column({ type: 'varchar', length: 64, unique: true })
  name: string;
}
