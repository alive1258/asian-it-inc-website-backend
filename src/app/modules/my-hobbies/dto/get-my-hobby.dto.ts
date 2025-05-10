import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base filter DTO for hobby records.
 */
class GetMyHobbyBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by full name shown in the hero section.',
    example: 'Sayem Ahmed',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by short description or tagline in the hero section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by image filename or URL for the hero section.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

/**
 * DTO for fetching hobbies with optional filters and pagination.
 */
export class GetMyHobbyDto extends IntersectionType(
  GetMyHobbyBaseDto,
  PaginationQueryDto,
) {}
