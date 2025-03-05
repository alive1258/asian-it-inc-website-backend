import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Points } from './entities/point.entity';

@Module({
  controllers: [PointsController],
  providers: [PointsService],
  imports: [TypeOrmModule.forFeature([Points])],
  exports: [PointsService],
})
export class PointsModule {}
