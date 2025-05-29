import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetBlogDetailBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the title of the blog detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the title of the blog detail.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Points must be a string.' })
  points?: string;

  @ApiPropertyOptional({
    description: 'Filter by the description of the blog detail.',
    example: 'john-doe',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by the photo URL or filename of the blog detail.',
    example: 'john-doe.jpg',
  })
  @ApiPropertyOptional({
    description: 'Filter by the photo URL or filename of the blog detail.',
    example: 'john-doe.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string.' })
  photo?: string;

  @ApiPropertyOptional({
    description: 'Filter by the blog ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'Blog ID must be a string.' })
  blog_id?: string;
}

export class GetBlogDetailDto extends IntersectionType(
  GetBlogDetailBaseDto,
  PaginationQueryDto,
) {}
