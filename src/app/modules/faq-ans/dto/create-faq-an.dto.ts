import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFaqAnDto {
  /**
   * question
   */
  @ApiProperty({
    description: 'headline',
    example: 'Example headline',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  question: string;
  /**
   * answer
   */
  @ApiProperty({
    description: 'headline',
    example: 'Example headline',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  answer: string;

  /**
   * relation with faq
   */
  @ApiProperty({
    description: 'Relation Id',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  faq_id: string;
}
