import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetWorkFlowToolBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the name.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'name must be a string.' })
  name?: string;
}

export class GetWorkFlowToolDto extends IntersectionType(
  GetWorkFlowToolBaseDto,
  PaginationQueryDto,
) {}
