import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateServiceFaqDto {
  @ApiProperty({
    description: 'The question or title of the FAQ entry.',
    example: 'What services does Asian IT Inc provide?',
    maxLength: 150,
  })
  @IsString({ message: 'Question must be a string.' })
  @IsNotEmpty({ message: 'Question must not be empty.' })
  @MaxLength(150, {
    message: 'Question can contain a maximum of 150 characters.',
  })
  question: string;

  /**
   * FAQ Answer
   */
  @ApiProperty({
    description: 'Detailed answer to the FAQ question.',
    example:
      'Asian IT Inc provides web development, mobile app development, and professional IT training for students and professionals.',
    maxLength: 400,
  })
  @IsString({ message: 'Answer must be a string.' })
  @IsNotEmpty({ message: 'Answer must not be empty.' })
  @MaxLength(400, {
    message: 'Answer can contain a maximum of 400 characters.',
  })
  answer: string;

  @ApiProperty({
    description: 'Service ID associated with this section.',
    example: '64e83291b2e1c2f8fa65f9ab',
    maxLength: 150,
  })
  @IsString({ message: 'Service ID must be a string.' })
  @MaxLength(150, {
    message: 'Service ID can contain a maximum of 150 characters.',
  })
  service_id: string;
}
