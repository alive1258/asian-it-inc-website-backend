import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * 🎯 Base filters for querying Portfolio entries
 */
class GetPortfolioBaseDto {
  @ApiPropertyOptional({
    description: 'Filter portfolios by project name.',
    example: 'E-commerce Platform',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter portfolios by company name.',
    example: 'TechSolutions Ltd.',
  })
  @IsOptional()
  @IsString({ message: 'Company name must be a string.' })
  company_name?: string;

  @ApiPropertyOptional({
    description: 'Filter portfolios by description text.',
    example: 'We built a fast and scalable solution.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;
}

/**
 * 🧾 DTO for fetching Portfolio entries with optional filters and pagination support
 */
export class GetPortfolioDto extends IntersectionType(
  GetPortfolioBaseDto,
  PaginationQueryDto,
) {}
