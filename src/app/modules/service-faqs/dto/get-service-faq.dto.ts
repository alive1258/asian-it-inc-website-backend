import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Base DTO for filtering FAQ entries
 */
class GetServiceFaqBaseDto {
  @ApiPropertyOptional({
    description: 'Search by the FAQ question/title.',
    example: 'What services does Asian IT Inc provide?',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  question?: string;

  @ApiPropertyOptional({
    description: 'Search by the FAQ answer or description content.',
    example:
      'Asian IT Inc provides full-stack development and IT training programs.',
  })
  @IsOptional()
  @IsString({ message: 'Answer must be a string.' })
  answer?: string;
}

/**
 * DTO for fetching FAQs with optional filters and pagination
 */
export class GetServiceFaqDto extends IntersectionType(
  GetServiceFaqBaseDto,
  PaginationQueryDto,
) {}
