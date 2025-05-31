import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({
    description: 'ID of the client providing the testimonial',
    example: 'client_12345',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  client_id: string;

  @ApiProperty({
    description: 'ID of the service the testimonial is related to',
    example: 'service_67890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  service_id: string;

  @ApiProperty({
    description: 'ID of the designation/job title for the client',
    example: 'designation_ceo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  designation_id: string;

  @ApiProperty({
    description: 'Rating given by the client (1 to 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  review: number;

  @ApiProperty({
    description: 'Client comments or testimonial content',
    example: 'This service exceeded my expectations!',
  })
  @IsString()
  @IsNotEmpty()
  comments: string;
}
