import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering FAQ introduction entries
 */
class GetWorkFlowBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the FAQ introduction headline.',
    example: 'Frequently Asked Questions',
  })
  @IsOptional()
  @IsString({ message: 'Headline must be a string.' })
  headline?: string;

  @ApiPropertyOptional({
    description: 'Filter by the FAQ introduction description.',
    example: 'Here you will find answers to the most common questions.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;
}

/**
 * DTO for fetching FAQ introduction entries with optional filters and pagination
 */
export class GetWorkFlowDto extends IntersectionType(
  GetWorkFlowBaseDto,
  PaginationQueryDto,
) {}
