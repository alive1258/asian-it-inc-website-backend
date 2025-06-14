import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkFlowToolDto {
  @ApiProperty({
    description: 'portfolio_id ID referencing the related team member.',
    example: '1',
  })
  @IsString({ message: 'portfolio_id ID must be a string.' })
  @IsNotEmpty({ message: 'portfolio_id ID is required.' })
  portfolio_id: string;

  @ApiProperty({
    description: 'work_flow_category_id referencing the related skill.',
    example: '5',
  })
  @IsString({ message: 'work_flow_category_id must be a string.' })
  @IsNotEmpty({ message: 'work_flow_category_id is required.' })
  work_flow_category_id: string;

  @ApiProperty({
    description: 'name referencing the related skill.',
    example: '5',
  })
  @IsString({ message: 'name must be a string.' })
  @IsNotEmpty({ message: 'name is required.' })
  name: string;

  @ApiPropertyOptional({
    description:
      'Filename or URL of the profile photo associated with the work gallery entry.',
    example: 'sayem-profile.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
