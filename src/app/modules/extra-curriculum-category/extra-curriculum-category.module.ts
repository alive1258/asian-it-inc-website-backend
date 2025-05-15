import { Module } from '@nestjs/common';
import { ExtraCurriculumCategoryService } from './extra-curriculum-category.service';
import { ExtraCurriculumCategoryController } from './extra-curriculum-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraCurriculumCategory } from './entities/extra-curriculum-category.entity';

@Module({
  controllers: [ExtraCurriculumCategoryController],
  providers: [ExtraCurriculumCategoryService],
  imports: [TypeOrmModule.forFeature([ExtraCurriculumCategory])],
  exports: [ExtraCurriculumCategoryService],
})
export class ExtraCurriculumCategoryModule {}
