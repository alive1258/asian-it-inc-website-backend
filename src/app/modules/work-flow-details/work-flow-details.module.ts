import { Module } from '@nestjs/common';
import { WorkFlowDetailsService } from './work-flow-details.service';
import { WorkFlowDetailsController } from './work-flow-details.controller';

@Module({
  controllers: [WorkFlowDetailsController],
  providers: [WorkFlowDetailsService],
})
export class WorkFlowDetailsModule {}
