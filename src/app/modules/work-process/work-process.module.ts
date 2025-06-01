import { Module } from '@nestjs/common';
import { WorkProcessService } from './work-process.service';
import { WorkProcessController } from './work-process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkProcess } from './entities/work-process.entity';

@Module({
  controllers: [WorkProcessController],
  providers: [WorkProcessService],
  exports: [WorkProcessService],
  imports: [TypeOrmModule.forFeature([WorkProcess])],
})
export class WorkProcessModule {}
