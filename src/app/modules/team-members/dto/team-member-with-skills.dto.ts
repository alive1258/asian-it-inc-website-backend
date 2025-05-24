import { TeamMember } from '../entities/team-member.entity';
import { TeamMemberSkill } from '../../team-member-skills/entities/team-member-skill.entity';

export class teamMemberSkills extends TeamMember {
  skill: TeamMemberSkill[];
}
