import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

// Base DTO for filtering work processes
class GetWorkProcessBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by title of the work process or team member.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by description of the work process or team member.',
    example: 'Senior developer with 10 years of experience.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the photo filename or URL.',
    example: 'john-doe.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string.' })
  photo?: string;

  @ApiPropertyOptional({
    description:
      'Filter by color code (used for UI tagging or categorization).',
    example: '#FF5733',
  })
  @IsOptional()
  @IsString({ message: 'Color code must be a string.' })
  color_code?: string;
}

// Final DTO with pagination support
export class GetWorkProcessDto extends IntersectionType(
  GetWorkProcessBaseDto,
  PaginationQueryDto,
) {}
