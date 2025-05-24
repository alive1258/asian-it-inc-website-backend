import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamMember } from '../../team-members/entities/team-member.entity';
import { SocialSite } from '../../system-table/social-sites/entities/social-site.entity';

@Entity({ name: 'team_member_social_link' })
export class TeamMemberSocialLink {
  /**
   * Primary Key - Unique ID for each social link entry
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Foreign Key - References the Team Member
   */
  @Column({ type: 'bigint' })
  member_id: string;

  @ManyToOne(() => TeamMember, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  teamMember: TeamMember;

  /**
   * Foreign Key - References the Social Site (e.g., Facebook, LinkedIn)
   */
  @Column({ type: 'bigint' })
  social_site_id: string;

  @ManyToOne(() => SocialSite, { nullable: false })
  @JoinColumn({ name: 'social_site_id' })
  socialSite: SocialSite;

  /**
   * Social profile URL
   */
  @Column({ type: 'varchar', nullable: false })
  url: string;

  /**
   * User ID of the person who added the social link
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
