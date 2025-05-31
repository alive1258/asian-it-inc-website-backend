import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering testimonials
 */
class GetTestimonialsBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the client ID.',
    example: 'client_12345',
  })
  @IsOptional()
  @IsString({ message: 'Client ID must be a string.' })
  client_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the service ID.',
    example: 'service_abc',
  })
  @IsOptional()
  @IsString({ message: 'Service ID must be a string.' })
  service_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the designation ID.',
    example: 'designation_ceo',
  })
  @IsOptional()
  @IsString({ message: 'Designation ID must be a string.' })
  designation_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by review rating (as string).',
    example: '5',
  })
  @IsOptional()
  @IsString({ message: 'Review must be a string.' }) // optionally, you can make this IsNumberString()
  review?: string;

  @ApiPropertyOptional({
    description: 'Filter by customer comments or testimonial text.',
    example: 'Excellent service!',
  })
  @IsOptional()
  @IsString({ message: 'Comments must be a string.' })
  comments?: string;
}

/**
 * DTO for querying testimonials with filters and pagination
 */
export class GetTestimonialsDto extends IntersectionType(
  GetTestimonialsBaseDto,
  PaginationQueryDto,
) {}
