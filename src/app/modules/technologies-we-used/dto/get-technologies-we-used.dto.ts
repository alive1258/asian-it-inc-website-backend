import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering Technologies We Used entries
 */
class GetTechnologiesWeUsedBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the name of the technology used.',
    example: 'React JS',
  })
  @IsOptional()
  @IsString({ message: 'Technology name must be a string.' })
  technology_name?: string;
}

/**
 * DTO for fetching Technologies We Used entries with optional filters and pagination
 */
export class GetTechnologiesWeUsedDto extends IntersectionType(
  GetTechnologiesWeUsedBaseDto,
  PaginationQueryDto,
) {}
