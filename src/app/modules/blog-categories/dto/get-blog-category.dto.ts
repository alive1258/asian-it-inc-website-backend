import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetBlogCategoryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter blog categories by name.',
    example: 'Technology',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;
}

export class GetBlogCategoryDto extends IntersectionType(
  GetBlogCategoryBaseDto,
  PaginationQueryDto,
) {}
