import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

/**
 * DTO for creating a portfolio entry.
 */
export class CreatePortfolioDto {
  // ------------------------
  // 📌 Basic Portfolio Info
  // ------------------------

  @ApiProperty({
    description: 'Title of the portfolio project.',
    example: 'Fast & Reliable Services',
    maxLength: 150,
  })
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(150, { message: 'Name can contain a maximum of 150 characters.' })
  name: string;

  @ApiProperty({
    description: 'Title of the portfolio project.',
    example: 'Fast & Reliable Services',
    maxLength: 150,
  })
  @IsString({ message: 'slug must be a string.' })
  @MaxLength(150, { message: 'slug can contain a maximum of 150 characters.' })
  slug: string;

  @ApiProperty({
    description: 'Short description of the project.',
    example: 'We provide fast and reliable services for our clients.',
    maxLength: 350,
  })
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(350, {
    message: 'Description can contain a maximum of 150 characters.',
  })
  description: string;

  // ------------------------
  // 🏢 Company Info
  // ------------------------

  @ApiProperty({
    description: 'Name of the client or company.',
    example: 'TechSolutions Ltd.',
    maxLength: 150,
  })
  @IsString({ message: 'Company name must be a string.' })
  @MaxLength(150, {
    message: 'Company name can contain a maximum of 150 characters.',
  })
  company_name: string;

  @ApiProperty({
    description: 'URL or path to the company logo image.',
    example: 'https://example.com/logo.png',
  })
  @IsString({ message: 'Company logo must be a string.' })
  company_logo: string;

  // ------------------------
  // 🖼️ Media Assets
  // ------------------------

  @ApiProperty({
    description: 'Thumbnail image URL of the project.',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString({ message: 'Thumbnail must be a string.' })
  thumbnail: string;

  @ApiProperty({
    description: 'Banner image URL of the project.',
    example: 'https://example.com/banner.jpg',
  })
  @IsString({ message: 'Banner must be a string.' })
  banner: string;

  // ------------------------
  // 🕒 Project Details
  // ------------------------

  @ApiProperty({
    description: 'Duration of the project (e.g., 3 weeks, 2 months).',
    example: '2 months',
    maxLength: 150,
  })
  @IsString({ message: 'Duration must be a string.' })
  @MaxLength(150, {
    message: 'Duration can contain a maximum of 150 characters.',
  })
  duration: string;

  // ------------------------
  // 🔗 Service Relation
  // ------------------------

  @ApiProperty({
    description: 'Associated service ID for this portfolio entry.',
    example: '64e83291b2e1c2f8fa65f9ab',
  })
  @IsString({ message: 'Service ID must be a string.' })
  service_id: string;
}
