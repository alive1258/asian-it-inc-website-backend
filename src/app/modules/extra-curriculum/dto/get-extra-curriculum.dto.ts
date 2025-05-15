import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for optional filters in extra curriculum snapshot query.
 */
class GetExtraCurriculumBaseDto {
  @ApiPropertyOptional({
    description: 'Title or name of the extra curriculum activity.',
    example: 'Inter-University Debate Championship',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Name of the institute where the activity was conducted.',
    example: 'University of Dhaka',
  })
  @IsString()
  @IsOptional()
  institute?: string;

  @ApiPropertyOptional({
    description: 'Name of the organization that organized the activity.',
    example: 'Bangladesh Debating Society',
  })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiPropertyOptional({
    description:
      'Additional data or description related to the curriculum activity.',
    example: 'Won the best speaker award in the final round.',
  })
  @IsString()
  @IsOptional()
  data?: string;

  @ApiPropertyOptional({
    description:
      'Optional photo filename (e.g., certificate or event snapshot).',
    example: 'debate-championship.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Foreign key ID of the related extra curriculum category.',
    example: 'abc123-category-id',
  })
  @IsString()
  @IsOptional()
  extra_curriculum_categories_id?: string;
}

/**
 * DTO for querying extra curriculum activities with filters and pagination.
 */
export class GetExtraCurriculumDto extends IntersectionType(
  GetExtraCurriculumBaseDto,
  PaginationQueryDto,
) {}
