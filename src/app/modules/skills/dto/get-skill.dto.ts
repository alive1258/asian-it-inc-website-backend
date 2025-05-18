import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetSkillBaseDto {
  /**
   * Title of the skill
   */
  @ApiPropertyOptional({
    description: 'Title of the skill',
    example: 'JavaScript',
  })
  @IsString()
  @IsOptional()
  skill_title?: string;

  /**
   * Amount or level of the skill
   */
  @ApiPropertyOptional({
    description: 'Amount or level of the skill',
    example: 'Advanced',
  })
  @IsString()
  @IsOptional()
  skill_amount?: string;

  /**
   * Foreign key ID of the related skill category
   */
  @ApiPropertyOptional({
    description: 'ID of the related skill category',
    example: '1',
  })
  @IsString()
  @IsOptional()
  skills_category_id?: string;
}

/**
 * DTO for fetching filtered and paginated skills data.
 */
export class GetSkillDto extends IntersectionType(
  GetSkillBaseDto,
  PaginationQueryDto,
) {}
