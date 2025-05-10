import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base query DTO for filtering home hero sections.
 */
class GetHomeAboutSectionBaseDto {
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
  thumbnail_image?: string;

  @ApiPropertyOptional({
    description: 'Filter by video URL.',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsOptional()
  @IsString()
  video_link?: string;
}

/**
 * DTO for retrieving home hero sections with optional filters and pagination.
 */
export class GetHomeAboutSectionDto extends IntersectionType(
  GetHomeAboutSectionBaseDto,
  PaginationQueryDto,
) {}
