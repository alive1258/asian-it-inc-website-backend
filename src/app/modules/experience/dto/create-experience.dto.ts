import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Engineering',
  })
  @IsString()
  @IsNotEmpty()
  faculty_name: string;

  @ApiProperty({
    description: 'Name of the institute or organization.',
    example: 'Bangladesh University of Engineering and Technology (BUET)',
  })
  @IsString()
  @IsNotEmpty()
  institute_name: string;

  @ApiProperty({
    description: 'Session or timeline of the experience.',
    example: '2019-2021',
  })
  @IsString()
  @IsNotEmpty()
  session: string;

  @ApiProperty({
    description: 'Position held during the experience.',
    example: 'Software Engineer Intern',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: 'Major subject or area of focus.',
    example: 'Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Duration of the experience.',
    example: '6 months',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({
    description: 'Title or heading for the experience.',
    example: 'Full-Stack Development Internship',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the role and responsibilities.',
    example:
      'Worked on developing scalable web applications using React and Node.js.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Skills gained or used during the experience.',
    example: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @ApiPropertyOptional({
    description: 'Photo filename or URL.',
    example: 'internship-photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Link to certificate or external proof.',
    example: 'https://www.linkedin.com/certificate/12345',
  })
  @IsOptional()
  @IsUrl()
  certificate_link?: string;
}
