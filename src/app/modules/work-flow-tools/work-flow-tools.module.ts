import { Module } from '@nestjs/common';
import { WorkFlowToolsService } from './work-flow-tools.service';
import { WorkFlowToolsController } from './work-flow-tools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlowTool } from './entities/work-flow-tool.entity';

@Module({
  controllers: [WorkFlowToolsController],
  providers: [WorkFlowToolsService],
  exports: [WorkFlowToolsService],
  imports: [TypeOrmModule.forFeature([WorkFlowTool])],
})
export class WorkFlowToolsModule {}
