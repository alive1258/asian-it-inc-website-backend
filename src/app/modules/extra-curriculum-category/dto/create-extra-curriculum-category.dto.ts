import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateExtraCurriculumCategoryDto {
  @ApiProperty({
    description:
      'Name of the extra curriculum category (e.g., Faculty or Department).',
    example: 'Faculty of Engineering',
    maxLength: 100,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;
}
