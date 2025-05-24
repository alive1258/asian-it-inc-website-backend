import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Name of the blog category.',
    example: 'Technology',
    maxLength: 150,
  })
  @IsString({ message: 'Category name must be a string.' })
  @MaxLength(150, {
    message: 'Category name can contain a maximum of 150 characters.',
  })
  name: string;
}
