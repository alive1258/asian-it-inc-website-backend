import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base filters for querying extra curriculum categories.
 */
class GetExtraCurriculumCategoryBaseDto {
  @ApiPropertyOptional({
    description:
      'Title of the extra curriculum category (e.g., department or faculty).',
    example: 'Faculty of Engineering',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;
}

/**
 * DTO for querying and paginating extra curriculum categories.
 */
export class GetExtraCurriculumCategoryDto extends IntersectionType(
  GetExtraCurriculumCategoryBaseDto,
  PaginationQueryDto,
) {}
