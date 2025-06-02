import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateWhyChooseDto {
  @ApiProperty({
    description: 'Headline for the Why Choose section.',
    example: 'Fast & Reliable Services',
    maxLength: 150,
  })
  @IsString({ message: 'Headline must be a string.' })
  @MaxLength(150, {
    message: 'Headline can contain a maximum of 150 characters.',
  })
  headline: string;

  @ApiProperty({
    description: 'Short description for the Why Choose section.',
    example: 'We provide fast and reliable services for our clients.',
    maxLength: 150,
  })
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(150, {
    message: 'Description can contain a maximum of 150 characters.',
  })
  description: string;

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
