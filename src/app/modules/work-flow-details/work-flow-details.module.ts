import { Module } from '@nestjs/common';
import { WorkFlowDetailsService } from './work-flow-details.service';
import { WorkFlowDetailsController } from './work-flow-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkFlowDetail } from './entities/work-flow-detail.entity';

@Module({
  controllers: [WorkFlowDetailsController],
  providers: [WorkFlowDetailsService],
  imports: [TypeOrmModule.forFeature([WorkFlowDetail])],
  exports: [WorkFlowDetailsService],
})
export class WorkFlowDetailsModule {}
