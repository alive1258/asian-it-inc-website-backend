import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
  imports: [TypeOrmModule.forFeature([Blog, BlogCategory])],
})
export class BlogsModule {}
