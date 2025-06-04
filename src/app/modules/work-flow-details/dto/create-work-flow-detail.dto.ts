import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkFlowDetailDto {
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
    description: 'title referencing the related skill.',
    example: '5',
  })
  @IsString({ message: 'title must be a string.' })
  @IsNotEmpty({ message: 'title is required.' })
  title: string;

  @ApiProperty({
    description: 'description referencing the related skill.',
    example: '5',
  })
  @IsString({ message: 'description must be a string.' })
  @IsNotEmpty({ message: 'description is required.' })
  description: string;
}
