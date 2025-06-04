import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkGalleryDto {
  @ApiProperty({
    description: 'Title or headline shown in the work gallery section.',
    example: 'A passionate learner focused on full-stack development.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required and cannot be empty.' })
  name: string;

  @ApiPropertyOptional({
    description:
      'Filename or URL of the profile photo associated with the work gallery entry.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
