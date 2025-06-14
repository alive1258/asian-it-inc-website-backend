import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetWorkFlowCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by workflow category name.',
    example: 'Development Process',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by photo filename or URL.',
    example: 'workflow-category-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string.' })
  photo?: string;

  @ApiPropertyOptional({
    description: 'Filter by associated portfolio ID.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsOptional()
  @IsString({ message: 'Portfolio ID must be a string.' })
  portfolio_id?: string;
}

export class GetWorkFlowCategoryDto extends IntersectionType(
  GetWorkFlowCategoryBaseDto,
  PaginationQueryDto,
) {}
