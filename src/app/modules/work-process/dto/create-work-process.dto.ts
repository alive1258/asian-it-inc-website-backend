import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkProcessDto {
  // Title of the team member or process step
  @ApiProperty({
    description: 'Title of the team member or work process step.',
    example: 'John Doe',
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  // Description or biography of the team member or work process step
  @ApiProperty({
    description:
      'Brief biography or description of the team member or process.',
    example: 'John is a senior developer with 10 years of experience...',
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  // Optional photo filename or URL (e.g., profile or process-related image)
  @ApiPropertyOptional({
    description: 'Filename or URL of the profile photo.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string if provided.' })
  photo?: string;

  // Color code associated with this process step (used for UI)
  @ApiProperty({
    description:
      'Color code associated with the work process item (e.g., #FF5733).',
    example: '#FF5733',
  })
  @IsString({ message: 'Color code must be a string.' })
  @IsNotEmpty({ message: 'Color code is required.' })
  color_code: string;
}
