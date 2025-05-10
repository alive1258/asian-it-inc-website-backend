import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateAboutMeDto {
  @ApiProperty({
    description: 'Title or headline shown in the about section.',
    example: 'A passionate learner focused on full-stack development.',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Main description for the about section.',
    example:
      'I specialize in building full-stack web applications using the MERN stack.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Sub-title or brief supportive text for the about section.',
    example: 'Transforming ideas into real-world applications.',
  })
  @IsString()
  @IsNotEmpty()
  sub_title: string;

  @ApiProperty({
    description: 'List of skills showcased in the about section.',
    example: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @ApiPropertyOptional({
    description: 'Filename or URL of the profile photo.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'URL to the CV, resume, or portfolio video.',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsOptional()
  @IsUrl()
  cv_link?: string;
}
