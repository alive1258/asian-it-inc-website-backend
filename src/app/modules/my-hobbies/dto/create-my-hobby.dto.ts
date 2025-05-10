import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMyHobbyDto {
  @ApiProperty({
    description: 'Full name of the individual displayed in the hero section.',
    example: 'Sayem Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Short descriptive text or tagline for the hero section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Optional image filename or URL used in the hero section.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
