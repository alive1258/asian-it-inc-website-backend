import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  // name of the team member or process step
  @ApiProperty({
    description: 'name of the team member or work process step.',
    example: 'John Doe',
  })
  @IsString({ message: 'name must be a string.' })
  @IsNotEmpty({ message: 'name is required.' })
  name: string;

  // Description or biography of the team member or work process step
  @ApiProperty({
    description:
      'Brief biography or short_description of the team member or process.',
    example: 'John is a senior developer with 10 years of experience...',
  })
  @IsString({ message: 'short_description must be a string.' })
  @IsNotEmpty({ message: 'short_description is required.' })
  short_description: string;

  // Optional featured_photo filename or URL (e.g., profile or process-related image)
  @ApiPropertyOptional({
    description: 'Filename or URL of the featured_photo photo.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString({ message: 'featured_photo must be a string if provided.' })
  service_icon?: string;

  // Optional featured_photo filename or URL (e.g., profile or process-related image)
  @ApiPropertyOptional({
    description: 'Filename or URL of the featured_photo photo.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString({ message: 'featured_photo must be a string if provided.' })
  featured_photo?: string;

  // Color code associated with this process step (used for UI)
  @ApiProperty({
    description:
      'Color code associated with the work process item (e.g., #FF5733).',
    example: '#FF5733',
  })
  @IsString({ message: 'Color code must be a string.' })
  @IsNotEmpty({ message: 'Color code is required.' })
  icon_bg_color: string;
}
