import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetBlogBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the blog title.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsOptional()
  @IsString({ message: 'Blog title must be a string.' })
  blog_title?: string;

  @ApiPropertyOptional({
    description: 'Filter by the blog slug.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by blog description.',
    example: 'A guide on creating REST APIs with NestJS.',
  })
  @IsOptional()
  @IsString({ message: 'Blog description must be a string.' })
  blog_description?: string;

  @ApiPropertyOptional({
    description: 'Filter by blog tags (comma-separated).',
    example: 'NestJS,API,Backend',
  })
  @IsOptional()
  @IsString({ message: 'Blog tags must be a string.' })
  blog_tags?: string;

  @ApiPropertyOptional({
    description: 'Filter by estimated reading time.',
    example: '5 min',
  })
  @IsOptional()
  @IsString({ message: 'Reading time must be a string.' })
  reading_time?: string;

  @ApiPropertyOptional({
    description: 'Filter by thumbnail filename or URL.',
    example: 'blog-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string.' })
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Filter by blog category ID.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsOptional()
  @IsString({ message: 'Blog category ID must be a string.' })
  blog_category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by blog team_member_id ID.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsOptional()
  @IsString({ message: 'team_member_id  ID must be a string.' })
  team_member_id?: string;
}

export class GetBlogDto extends IntersectionType(
  GetBlogBaseDto,
  PaginationQueryDto,
) {}
