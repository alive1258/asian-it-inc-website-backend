import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberSkillDto } from './create-team-member-skill.dto';

export class UpdateTeamMemberSkillDto extends PartialType(CreateTeamMemberSkillDto) {}
