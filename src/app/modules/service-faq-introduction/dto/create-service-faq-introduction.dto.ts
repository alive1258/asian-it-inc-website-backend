import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceFaqIntroductionDto {
  @ApiProperty({
    description: 'Headline for the FAQ introduction section.',
    example: 'Frequently Asked Questions',
  })
  @IsString({ message: 'Headline must be a string.' })
  @IsNotEmpty({ message: 'Headline is required.' })
  headline: string;

  @ApiProperty({
    description: 'Description or summary for the FAQ section.',
    example: 'Here you will find answers to the most common questions.',
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @ApiPropertyOptional({
    description:
      'Filename or URL of the photo associated with the FAQ section.',
    example: 'faq-photo.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string if provided.' })
  photo?: string;

  @ApiProperty({
    description: 'ID of the service this FAQ introduction is related to.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Service ID must be a string.' })
  @IsNotEmpty({ message: 'Service ID is required.' })
  service_id: string;
}
