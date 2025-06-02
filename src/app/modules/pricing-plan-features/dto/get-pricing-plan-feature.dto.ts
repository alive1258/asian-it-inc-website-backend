import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering Technologies We Used entries
 */
class GetPricingPlanFeaturesBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the name of the price used.',
    example: 'React JS',
  })
  @IsOptional()
  @IsString({ message: 'price name must be a string.' })
  benefit?: string;
}

/**
 * DTO for fetching Technologies We Used entries with optional filters and pagination
 */
export class GetPricingPlanFeaturesDto extends IntersectionType(
  GetPricingPlanFeaturesBaseDto,
  PaginationQueryDto,
) {}
