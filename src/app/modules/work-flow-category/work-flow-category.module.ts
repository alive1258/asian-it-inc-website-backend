import { Module } from '@nestjs/common';
import { WorkFlowCategoryService } from './work-flow-category.service';
import { WorkFlowCategoryController } from './work-flow-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlowCategory } from './entities/work-flow-category.entity';

@Module({
  controllers: [WorkFlowCategoryController],
  providers: [WorkFlowCategoryService],
  exports: [WorkFlowCategoryService],
  imports: [TypeOrmModule.forFeature([WorkFlowCategory])],
})
export class WorkFlowCategoryModule {}
