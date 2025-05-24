import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({
    description: 'Full name of the team member.',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty({
    description: 'URL-friendly unique identifier for the team member.',
    example: 'john-doe',
  })
  @IsString({ message: 'Slug must be a string.' })
  @IsNotEmpty({ message: 'Slug is required.' })
  slug: string;

  @ApiPropertyOptional({
    description:
      'Filename or URL of the profile photo associated with the work gallery entry.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    description: 'Brief biography or description of the team member.',
    example: 'John is a senior developer with 10 years of experience...',
  })
  @IsString({ message: 'Biography must be a string.' })
  @IsNotEmpty({ message: 'Biography is required.' })
  biography: string;

  @ApiProperty({
    description: 'Designation ID referencing the related designation.',
    example: '1',
  })
  @IsString({ message: 'Designation ID must be a string.' })
  @IsNotEmpty({ message: 'Designation ID is required.' })
  designation_id: string;
}
