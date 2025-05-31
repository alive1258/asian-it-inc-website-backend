import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateContactUsDto {
  @ApiProperty({ example: '+0121471457' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email_address: string;

  @ApiProperty({ example: '123 Creative Street, New York, USA 123' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/username' })
  @IsOptional()
  @IsString()
  facebook_url?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/username' })
  @IsOptional()
  @IsString()
  instagram_url?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsString()
  linkedin_url?: string;

  @ApiPropertyOptional({ example: 'https://x.com/username' })
  @IsOptional()
  @IsString()
  x_url?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  web_url?: string;
}
