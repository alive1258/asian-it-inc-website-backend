import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan_type')
export class PlanType {
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
