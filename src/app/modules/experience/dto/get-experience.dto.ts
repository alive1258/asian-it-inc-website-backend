import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsArray, IsIn } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base query DTO for filtering experience data.
 */
class GetExperienceBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by faculty name',
    example: 'Engineering',
  })
  @IsOptional()
  @IsString()
  faculty_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by institute name',
    example: 'North South University',
  })
  @IsOptional()
  @IsString()
  institute_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by session',
    example: '2019-2020',
  })
  @IsOptional()
  @IsString()
  session?: string;

  @ApiPropertyOptional({ description: 'Filter by position', example: 'Intern' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Filter by subject',
    example: 'Computer Science',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    description: 'Filter by duration',
    example: '6 months',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: 'Filter by title',
    example: 'Frontend Developer Internship',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by description',
    example: 'Developed UI using React',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by skills (partial match of any skill)',
    example: 'React',
  })
  @IsOptional()
  @IsString()
  skills?: string;

  @ApiPropertyOptional({
    description: 'Filter by photo filename',
    example: 'profile-photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Filter by certificate link',
    example: 'https://example.com/certificate',
  })
  @IsOptional()
  @IsUrl()
  certificate_link?: string;
}

/**
 * DTO for retrieving experiences with optional filters and pagination.
 */
export class GetExperienceDto extends IntersectionType(
  GetExperienceBaseDto,
  PaginationQueryDto,
) {}
