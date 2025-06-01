import { Module } from '@nestjs/common';
import { WorkProcessService } from './work-process.service';
import { WorkProcessController } from './work-process.controller';

@Module({
  controllers: [WorkProcessController],
  providers: [WorkProcessService],
})
export class WorkProcessModule {}
