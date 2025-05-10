import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHomeHeroSectionDto {
  /**
   * Full name of the individual displayed in the hero section.
   * This is a required field and must be a string.
   */
  @ApiProperty({
    description: 'Full name of the individual shown in the hero section.',
    example: 'Sayem Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The educational class or degree name (e.g., MSC, BSC, etc.).
   * Required string field.
   */
  @ApiProperty({
    description: 'Educational class or title designation.',
    example: 'MSC in Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  class_name: string;

  /**
   * The name of the course or program the person is involved with.
   * Required string field.
   */
  @ApiProperty({
    description:
      'Name of the course the person is enrolled in or representing.',
    example: 'Professional Executive Education (PEE)',
  })
  @IsString()
  @IsNotEmpty()
  course_name: string;

  /**
   * A short descriptive text or tagline for the hero section.
   * Required string field.
   */
  @ApiProperty({
    description: 'Short description or tagline shown in the hero section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Optional link to the CV or portfolio.
   * Must be a valid URL if provided.
   */
  @ApiPropertyOptional({
    description: 'Link to the CV or portfolio (must be a valid URL).',
    example: 'https://example.com/cv.pdf',
  })
  @IsOptional()
  @IsUrl()
  cv_link?: string;

  /**
   * Optional filename or URL for the photo displayed in the hero section.
   * Accepts a string.
   */
  @ApiPropertyOptional({
    description: 'Photo filename or URL to the hero image.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
