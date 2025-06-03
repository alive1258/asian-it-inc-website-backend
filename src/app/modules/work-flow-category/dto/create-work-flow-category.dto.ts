import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkFlowCategoryDto {
  @ApiProperty({
    description: 'Name of the workflow category.',
    example: 'Development Process',
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Optional photo filename or URL for the category.',
    example: 'workflow-category-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string if provided.' })
  photo?: string;

  @ApiProperty({
    description: 'ID of the associated portfolio.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Portfolio ID must be a string.' })
  @IsNotEmpty({ message: 'Portfolio ID is required.' })
  portfolio_id: string;
}
