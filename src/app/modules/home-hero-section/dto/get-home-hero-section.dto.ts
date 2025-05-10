import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base query DTO for filtering home hero sections.
 */
class GetHomeHeroSectionBaseDto {
  @ApiPropertyOptional({
    description: 'Search by individual name shown in the hero section.',
    example: 'Sayem Ahmed',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by educational class or title.',
    example: 'MSC in Computer Science',
  })
  @IsOptional()
  @IsString()
  class_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by course name.',
    example: 'Professional Executive Education (PEE)',
  })
  @IsOptional()
  @IsString()
  course_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by a keyword in the description or tagline.',
    example: 'full-stack development',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by photo filename or image URL.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

/**
 * DTO for retrieving home hero sections with optional filters and pagination.
 */
export class GetHomeHeroSectionDto extends IntersectionType(
  GetHomeHeroSectionBaseDto,
  PaginationQueryDto,
) {}
