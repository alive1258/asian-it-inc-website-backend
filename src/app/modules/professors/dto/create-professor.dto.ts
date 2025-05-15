import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProfessorDto {
  @ApiProperty({
    description: 'Full name of the professor.',
    example: 'Dr. Sayem Hossain',
  })
  @IsString()
  @IsNotEmpty()
  professor_name: string;

  @ApiProperty({
    description: 'Name of the department the professor belongs to.',
    example: 'Computer Science and Engineering',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Name of the institute the professor is affiliated with.',
    example: 'Bangladesh University of Engineering and Technology (BUET)',
  })
  @IsString()
  @IsNotEmpty()
  institute: string;

  @ApiProperty({
    description: 'Professional title of the professor.',
    example: 'Associate Professor',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'List of research subject titles.',
    example: ['Artificial Intelligence', 'Machine Learning'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  research_subject_title: string[];

  @ApiProperty({
    description: "Brief description of the professor's work or focus.",
    example:
      'I specialize in AI-driven systems and full-stack web development.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: "Filename or URL of the professor's profile photo.",
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
