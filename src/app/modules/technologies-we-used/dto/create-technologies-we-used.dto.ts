import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTechnologiesWeUsedDto {
  @ApiProperty({
    description: 'ID of the service this technology is associated with.',
    example: 'service_67890',
    maxLength: 128,
  })
  @IsString({ message: 'Service ID must be a string.' })
  @IsNotEmpty({ message: 'Service ID is required.' })
  @MaxLength(128, { message: 'Service ID must be at most 128 characters.' })
  service_id: string;

  @ApiProperty({
    description: 'ID of the technology used.',
    example: 'tech_reactjs',
    maxLength: 128,
  })
  @IsString({ message: 'Technology ID must be a string.' })
  @IsNotEmpty({ message: 'Technology ID is required.' })
  @MaxLength(128, { message: 'Technology ID must be at most 128 characters.' })
  technology_id: string;

  @ApiProperty({
    description: 'Name of the technology used.',
    example: 'React JS',
  })
  @IsString({ message: 'Technology name must be a string.' })
  @IsNotEmpty({ message: 'Technology name is required.' })
  technology_name: string;

  @ApiPropertyOptional({
    description: 'Icon filename or URL representing the technology.',
    example: 'react-icon.png',
  })
  @IsOptional()
  @IsString({ message: 'Icon must be a string if provided.' })
  icon?: string;
}
