import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_site')
export class SocialSite {
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
