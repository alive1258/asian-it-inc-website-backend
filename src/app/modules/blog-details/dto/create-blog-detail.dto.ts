import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDetailDto {
  @ApiProperty({
    description: 'Title of the blog post.',
    example: 'How to Build a REST API with NestJS',
  })
  @IsString({ message: 'Blog title must be a string.' })
  @IsNotEmpty({ message: 'Blog title is required.' })
  title: string;

  @ApiProperty({
    description: 'Points of the blog post.',
    example: [
      'Learn NestJS routing',
      'Use DTOs for validation',
      'Implement authentication',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  points: string[];

  @ApiProperty({
    description: 'Description or content summary of the blog post.',
    example:
      'This blog post explains how to create a RESTful API using NestJS...',
  })
  @IsString({ message: 'Blog description must be a string.' })
  @IsNotEmpty({ message: 'Blog description is required.' })
  description: string;

  @ApiPropertyOptional({
    description: 'Filename or URL of the thumbnail image for the blog post.',
    example: 'blog-thumbnail.jpg',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photo?: string[];

  @ApiProperty({
    description: 'ID of the blog  associated with this blog post.',
    example: '64cbb7f1c84f49ecb6d7f8de',
  })
  @IsString({ message: 'Blog  ID must be a string.' })
  @IsNotEmpty({ message: 'Blog  ID is required.' })
  blog_id: string;
}
