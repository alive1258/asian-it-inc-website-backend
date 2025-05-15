import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * Filter fields for retrieving educational collaboration records.
 */
class GetCollaborateFilterDto {
  @ApiPropertyOptional({
    description: 'Title of the collaboration or department/faculty',
    example: 'Faculty of Engineering',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the collaboration or institute',
    example: 'Bangladesh University of Engineering and Technology (BUET)',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO for fetching filtered and paginated educational collaboration data.
 */
export class GetCollaborateDto extends IntersectionType(
  GetCollaborateFilterDto,
  PaginationQueryDto,
) {}
