import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetSnapshotsCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Title of the collaboration or department/faculty',
    example: 'Faculty of Engineering',
  })
  @IsOptional()
  @IsString()
  title?: string;
}

/**
 * DTO for fetching filtered and paginated educational collaboration data.
 */
export class GetSnapshotsCategoryDto extends IntersectionType(
  GetSnapshotsCategoryBaseDto,
  PaginationQueryDto,
) {}
