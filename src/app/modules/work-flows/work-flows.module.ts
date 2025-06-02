import { Module } from '@nestjs/common';
import { WorkFlowsService } from './work-flows.service';
import { WorkFlowsController } from './work-flows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlow } from './entities/work-flow.entity';

@Module({
  controllers: [WorkFlowsController],
  providers: [WorkFlowsService],
  exports: [WorkFlowsService],
  imports: [TypeOrmModule.forFeature([WorkFlow])],
})
export class WorkFlowsModule {}
