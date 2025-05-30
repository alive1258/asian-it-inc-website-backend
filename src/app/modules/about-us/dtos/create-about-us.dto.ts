import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateAboutUsDto {
  @ApiProperty({ example: 'Welcome to Our Company' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'We provide top-notch services to global clients.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'banner.jpg' })
  @IsNotEmpty()
  @IsString()
  banner_image: string;

  // Success project
  @ApiProperty({ example: 'Successful Projects' })
  @IsNotEmpty()
  @IsString()
  success_project_title: string;

  @ApiProperty({ example: '250' })
  @IsNotEmpty()
  @IsNumberString()
  success_project_number: string;

  @ApiProperty({ example: 'We have completed 250+ successful projects.' })
  @IsNotEmpty()
  @IsString()
  success_project_description: string;

  // Creative minds
  @ApiProperty({ example: 'Creative Minds' })
  @IsNotEmpty()
  @IsString()
  creative_minds_title: string;

  @ApiProperty({ example: '30' })
  @IsNotEmpty()
  @IsNumberString()
  creative_minds_number: string;

  @ApiProperty({ example: '30+ creative professionals are working with us.' })
  @IsNotEmpty()
  @IsString()
  creative_minds_description: string;

  // Countries service
  @ApiProperty({ example: 'Countries Served' })
  @IsNotEmpty()
  @IsString()
  countries_service_title: string;

  @ApiProperty({ example: '15' })
  @IsNotEmpty()
  @IsNumberString()
  countries_service_number: string;

  @ApiProperty({ example: 'Our services are available in over 15 countries.' })
  @IsNotEmpty()
  @IsString()
  countries_service_description: string;

  // Client satisfaction
  @ApiProperty({ example: 'Client Satisfaction' })
  @IsNotEmpty()
  @IsString()
  client_satisfaction_title: string;

  @ApiProperty({ example: '99' })
  @IsNotEmpty()
  @IsNumberString()
  client_satisfaction_number: string;

  @ApiProperty({ example: '99% of our clients are satisfied with our service.' })
  @IsNotEmpty()
  @IsString()
  client_satisfaction_description: string;

}
