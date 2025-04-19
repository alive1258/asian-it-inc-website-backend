import { IntersectionType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for querying testimonials
 */
class GetTestimonialsBaseDto {
  /**
   * Filter by customer name (optional)
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Filter by customer photo filename or URL (optional)
   */
  @IsString()
  @IsOptional()
  photo?: string;

  /**
   * Filter by customer review rating (optional)
   */
  @IsNumber()
  @IsOptional()
  review?: number;

  /**
   * Filter by customer designation (optional)
   */
  @IsString()
  @IsOptional()
  designation?: string;

  /**
   * Filter by customer message/testimonial (optional)
   */
  @IsString()
  @IsOptional()
  massage?: string;
}

/**
 * DTO for querying testimonials with pagination support
 */
export class GetTestimonialsDto extends IntersectionType(
  GetTestimonialsBaseDto,
  PaginationQueryDto,
) {}
