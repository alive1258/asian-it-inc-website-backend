import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'about_us' })
export class AboutUs {
  /**
   * Primary key ID (auto-incremented bigint)
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Hero section name
   */
  @Column({ type: 'varchar', nullable: false })
  name: string;


  @Column({ type: 'varchar', nullable: false })
  description: string;


  @Column({ type: 'varchar', nullable: false })
  banner_image: string;

  //  success project 
  @Column({ type: 'varchar', nullable: false })
  success_project_title: string;


  @Column({ type: 'varchar', nullable: false })
  success_project_number: string;


  @Column({ type: 'varchar', nullable: false })
  success_project_description: string;



  //  creative minds
  @Column({ type: 'varchar', nullable: false })
  creative_minds_title: string;


  @Column({ type: 'varchar', nullable: false })
  creative_minds_number: string;


  @Column({ type: 'varchar', nullable: false })
  creative_minds_description: string;



  //  countries_service
  @Column({ type: 'varchar', nullable: false })
  countries_service_title: string;


  @Column({ type: 'varchar', nullable: false })
  countries_service_number: string;


  @Column({ type: 'varchar', nullable: false })
  countries_service_description: string;


  //  client_satisfaction
  @Column({ type: 'varchar', nullable: false })
  client_satisfaction_title: string;


  @Column({ type: 'varchar', nullable: false })
  client_satisfaction_number: string;


  @Column({ type: 'varchar', nullable: false })
  client_satisfaction_description: string;

  /**
   * User ID who added this entry
   */
  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  /**
   * Timestamp when the record was created
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /**
   * Timestamp when the record was last updated
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
