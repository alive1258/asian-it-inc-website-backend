import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFaqDto {
  /**
   * headline
   */
  @ApiProperty({
    description: 'headline',
    example: 'Example headline',
  })
  @IsString()
  @IsNotEmpty()
  headline: string;

  /**
   * photo
   */
  @ApiProperty({
    description: 'Investor Photo',
    example: 'investor-photo.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
