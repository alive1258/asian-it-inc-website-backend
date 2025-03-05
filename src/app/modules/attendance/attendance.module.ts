import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService],
  imports: [TypeOrmModule.forFeature([Attendance])],
  exports: [AttendanceService],
})
export class AttendanceModule {}
