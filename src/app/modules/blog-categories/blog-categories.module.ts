import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { BlogCategoriesController } from './blog-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog-category.entity';

@Module({
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService],
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  exports: [BlogCategoriesService],
})
export class BlogCategoriesModule {}
