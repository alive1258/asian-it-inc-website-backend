import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetTeamMemberSocialLinkBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the team member ID.',
    example: '1a2b3c',
  })
  @IsOptional()
  @IsString({ message: 'Team member ID must be a string.' })
  member_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the social site ID (e.g., facebook, linkedin).',
    example: 'facebook',
  })
  @IsOptional()
  @IsString({ message: 'Social site ID must be a string.' })
  social_site_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the social profile URL.',
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL must be a valid URL.' })
  url?: string;
}

export class GetTeamMemberSocialLinkDto extends IntersectionType(
  GetTeamMemberSocialLinkBaseDto,
  PaginationQueryDto,
) {}
