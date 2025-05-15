import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExtraCurriculumDto {
  @ApiProperty({
    description: 'Title or name of the extra curriculum activity.',
    example: 'Inter-University Debate Championship',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Name of the institute where the activity was conducted.',
    example: 'University of Dhaka',
  })
  @IsString()
  @IsNotEmpty()
  institute: string;

  @ApiProperty({
    description: 'Name of the organization that organized the activity.',
    example: 'Bangladesh Debating Society',
  })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({
    description:
      'Additional data or description related to the curriculum activity.',
    example: 'Won the best speaker award in the final round.',
  })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiPropertyOptional({
    description:
      'Optional photo filename representing the activity (e.g., certificate or event snapshot).',
    example: 'debate-championship.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({
    description: 'Foreign key ID of the related extra curriculum category.',
    example: 'abc123-category-id',
  })
  @IsString()
  @IsNotEmpty()
  extra_curriculum_categories_id: string;
}
