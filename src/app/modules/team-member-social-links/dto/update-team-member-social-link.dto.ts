import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberSocialLinkDto } from './create-team-member-social-link.dto';

export class UpdateTeamMemberSocialLinkDto extends PartialType(CreateTeamMemberSocialLinkDto) {}
