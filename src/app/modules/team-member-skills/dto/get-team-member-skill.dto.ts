import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetTeamMemberSkillBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the member ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'member ID must be a string.' })
  member_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the skill_id ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'skill_id ID must be a string.' })
  skill_id?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Relations to include (e.g. skill, team)',
    example: ['skill'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensure each item in array is a string
  relations?: string[];
}

export class GetTeamMemberSkillDto extends IntersectionType(
  GetTeamMemberSkillBaseDto,
  PaginationQueryDto,
) {}
