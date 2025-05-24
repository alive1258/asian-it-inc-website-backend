import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'Blog title must be a string.' })
  @IsNotEmpty({ message: 'Blog title is required.' })
  blog_title: string;

  @ApiProperty({
    description: 'URL-friendly slug for the blog post.',
    example: 'how-to-build-a-rest-api-with-nestjs',
  })
  @IsString({ message: 'Slug must be a string.' })
  @IsNotEmpty({ message: 'Slug is required.' })
  slug: string;

  @ApiProperty({
    description: 'Description or content summary of the blog post.',
    example:
      'This blog post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'Blog description must be a string.' })
  @IsNotEmpty({ message: 'Blog description is required.' })
  blog_description: string;

  @ApiProperty({
    description: 'Tags related to the blog post, comma-separated.',
    example: 'NestJS,API,Backend',
  })
  @IsString({ message: 'Blog tags must be a string.' })
  @IsNotEmpty({ message: 'Blog tags are required.' })
  blog_tags: string;

  @ApiProperty({
    description: 'Estimated reading time for the blog post.',
    example: '5 min',
  })
  @IsString({ message: 'Reading time must be a string.' })
  @IsNotEmpty({ message: 'Reading time is required.' })
  reading_time: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the blog post.',
    example: 'blog-thumbnail.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string if provided.' })
  thumbnail?: string;

  @ApiProperty({
    description: 'ID of the blog category associated with this blog post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Blog category ID must be a string.' })
  @IsNotEmpty({ message: 'Blog category ID is required.' })
  blog_category_id: string;

  @ApiProperty({
    description: 'ID of the blog category associated with this blog post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Blog category ID must be a string.' })
  @IsNotEmpty({ message: 'Blog category ID is required.' })
  team_member_id: string;
}
