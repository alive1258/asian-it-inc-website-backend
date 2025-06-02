import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering testimonials
 */
class GetServiceBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the client ID.',
    example: 'client_12345',
  })
  @IsOptional()
  @IsString({ message: 'Client ID must be a string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by the service ID.',
    example: 'service_abc',
  })
  @IsOptional()
  @IsString({ message: 'Service ID must be a string.' })
  short_description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the designation ID.',
    example: 'designation_ceo',
  })
  @IsOptional()
  @IsString({ message: 'Designation ID must be a string.' })
  icon_bg_color?: string;
}

/**
 * DTO for querying testimonials with filters and pagination
 */
export class GetServiceDto extends IntersectionType(
  GetServiceBaseDto,
  PaginationQueryDto,
) {}
