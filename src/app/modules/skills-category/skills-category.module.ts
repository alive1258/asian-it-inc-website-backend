import { Module } from '@nestjs/common';
import { SkillsCategoryService } from './skills-category.service';
import { SkillsCategoryController } from './skills-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsCategory } from './entities/skills-category.entity';

@Module({
  controllers: [SkillsCategoryController],
  providers: [SkillsCategoryService],
  imports: [TypeOrmModule.forFeature([SkillsCategory])],
  exports: [SkillsCategoryService],
})
export class SkillsCategoryModule {}
