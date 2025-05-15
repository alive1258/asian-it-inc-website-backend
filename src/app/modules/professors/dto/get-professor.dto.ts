import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Filters for querying professor data.
 */
class GetProfessorBaseDto {
  @ApiPropertyOptional({
    description: 'Full name of the professor.',
    example: 'Dr. Sayem Hossain',
  })
  @IsOptional()
  @IsString()
  professor_name?: string;

  @ApiPropertyOptional({
    description: 'Department the professor belongs to.',
    example: 'Computer Science and Engineering',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Institute the professor is affiliated with.',
    example: 'Bangladesh University of Engineering and Technology (BUET)',
  })
  @IsOptional()
  @IsString()
  institute?: string;

  @ApiPropertyOptional({
    description: 'Professional title of the professor.',
    example: 'Associate Professor',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'List of research subject titles.',
    example: ['Artificial Intelligence', 'Machine Learning'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  research_subject_title?: string[];

  @ApiPropertyOptional({
    description: "Brief description of the professor's expertise.",
    example: 'I specialize in AI-driven systems and full-stack development.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Filename or URL of the professor's profile photo.",
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}

/**
 * DTO for retrieving professors with pagination and filters.
 */
export class GetProfessorDto extends IntersectionType(
  GetProfessorBaseDto,
  PaginationQueryDto,
) {}
