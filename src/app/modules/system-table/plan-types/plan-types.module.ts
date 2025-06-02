import { Module } from '@nestjs/common';
import { PlanTypesService } from './plan-types.service';
import { PlanTypesController } from './plan-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanType } from './entities/plan-type.entity';

@Module({
  controllers: [PlanTypesController],
  providers: [PlanTypesService],
  exports: [PlanTypesService],
  imports: [TypeOrmModule.forFeature([PlanType])],
})
export class PlanTypesModule {}
