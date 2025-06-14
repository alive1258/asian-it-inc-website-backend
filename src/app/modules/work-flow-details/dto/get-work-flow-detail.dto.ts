import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetWorkFlowDetailBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the title.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'description must be a string.' })
  description?: string;
}

export class GetWorkFlowDetailDto extends IntersectionType(
  GetWorkFlowDetailBaseDto,
  PaginationQueryDto,
) {}
