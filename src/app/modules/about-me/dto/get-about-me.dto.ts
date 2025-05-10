import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering the "About Me" section.
 */
class GetAboutMeBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by title or headline shown in the about section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by description or main text content.',
    example:
      'I specialize in building full-stack web applications using the MERN stack.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by subtitle or secondary headline.',
    example: 'Transforming ideas into real-world applications.',
  })
  @IsOptional()
  @IsString()
  sub_title?: string;

  @ApiPropertyOptional({
    description: 'Filter by list of skills (must include at least one skill).',
    example: ['JavaScript', 'React'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    description: 'Filter by profile photo filename or URL.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description:
      'Filter by CV or portfolio link (must be a valid URL if present).',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsOptional()
  @IsUrl()
  cv_link?: string;
}

/**
 * DTO for retrieving "About Me" entries with optional filters and pagination.
 */
export class GetAboutMeDto extends IntersectionType(
  GetAboutMeBaseDto,
  PaginationQueryDto,
) {}
