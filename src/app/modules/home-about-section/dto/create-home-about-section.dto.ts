import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHomeAboutSectionDto {
  /**
   * A short descriptive text or tagline for the home about section.
   * Required string field.
   */
  @ApiProperty({
    description:
      'Short description or tagline shown in the home about section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Optional filename or URL for the thumbnail image displayed in the home about section.
   * Accepts a string.
   */
  @ApiPropertyOptional({
    description: 'Photo filename or URL to the thumbnail image.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail_image?: string;

  /**
   * Optional link to the CV or portfolio.
   * Must be a valid URL if provided.
   */
  @ApiPropertyOptional({
    description: 'Link to the video (must be a valid URL).',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsOptional()
  @IsUrl()
  video_link?: string;
}
