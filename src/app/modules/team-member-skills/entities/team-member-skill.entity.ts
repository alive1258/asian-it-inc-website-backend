import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Designation } from '../../designations/entities/designation.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { TeamMember } from '../../team-members/entities/team-member.entity';

@Entity({ name: 'team_member_skills' })
export class TeamMemberSkill {
  /**
   * Primary Key - Unique ID for each team member
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  /**
   * Foreign key referencing the designation of the team member
   */
  @Column({ type: 'bigint' })
  member_id: string;

  @Column({ type: 'bigint' })
  skill_id: string;

  @ManyToOne(() => Skill, {
    nullable: false,
  })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => TeamMember, {
    nullable: false,
  })
  @JoinColumn({ name: 'member_id' })
  teamMember: TeamMember;

  /**
   * User ID of the person who added the team member
   */
  @Column({ type: 'bigint' })
  added_by: string;

  /**
   * Timestamp of when the record was created
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  /**
   * Timestamp of the last update to the record
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
