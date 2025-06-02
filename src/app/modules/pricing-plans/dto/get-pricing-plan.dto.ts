import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering Technologies We Used entries
 */
class GetPricingPlanBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the name of the price used.',
    example: 'React JS',
  })
  @IsOptional()
  @IsString({ message: 'price name must be a string.' })
  price?: string;

  @ApiPropertyOptional({
    description: 'Filter by the name of the regular_price used.',
    example: 'React JS',
  })
  @IsOptional()
  @IsString({ message: 'regular_price name must be a string.' })
  regular_price?: string;

  @ApiPropertyOptional({
    description: 'Filter by the name of the headline used.',
    example: 'React JS',
  })
  @IsOptional()
  @IsString({ message: 'headline name must be a string.' })
  headline?: string;
}

/**
 * DTO for fetching Technologies We Used entries with optional filters and pagination
 */
export class GetPricingPlanDto extends IntersectionType(
  GetPricingPlanBaseDto,
  PaginationQueryDto,
) {}
