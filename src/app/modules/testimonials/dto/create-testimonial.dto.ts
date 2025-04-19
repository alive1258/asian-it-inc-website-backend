import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTestimonialDto {
  /**
   * Customer Name
   */
  @ApiProperty({
    description: 'Customer Name',
    example: 'Example Customer name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  /**
   * Customer Photo (optional)
   */
  @ApiProperty({
    description: 'Customer Photo',
    example: 'Customer photo.jpg',
    required: false, // Marking as optional in Swagger docs
  })
  @IsString()
  @IsOptional()
  photo?: string;

  /**
   * Customer Review Rating
   */
  @ApiProperty({
    description: 'Customer review rating (e.g., 1 to 5)',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  review: number;

  /**
   * Customer Designation
   */
  @ApiProperty({
    description: 'Customer designation or job title',
    example: 'CEO, Manager, Director',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  designation: string;

  /**
   * Customer Message
   */
  @ApiProperty({
    description: 'Customer testimonial message',
    example: 'This company provided outstanding service!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
