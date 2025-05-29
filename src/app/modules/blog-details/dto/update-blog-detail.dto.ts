import { PartialType } from '@nestjs/swagger';
import { CreateBlogDetailDto } from './create-blog-detail.dto';

export class UpdateBlogDetailDto extends PartialType(CreateBlogDetailDto) {}
