import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHomeHeroDto {
  @ApiProperty({
    description: 'Main title or headline for the home hero section.',
    example: 'Empowering the Next Generation of Tech Innovators',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty.' })
  @MaxLength(150, { message: 'Title can contain a maximum of 150 characters.' })
  title: string;

  @ApiProperty({
    description: 'Subtext or descriptive paragraph below the hero title.',
    example:
      'At Asian IT Inc, we transform ideas into digital success through top-tier full-stack development and IT training.',
    maxLength: 400,
  })
  @IsString()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @MaxLength(400, {
    message: 'Description can contain a maximum of 400 characters.',
  })
  description: string;
}
