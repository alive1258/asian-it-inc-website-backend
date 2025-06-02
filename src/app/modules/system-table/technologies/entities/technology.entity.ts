import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('technologies')
export class Technology {
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
