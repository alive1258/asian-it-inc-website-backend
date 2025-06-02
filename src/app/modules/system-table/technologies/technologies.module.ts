import { Module } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';

@Module({
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService],
  imports: [TypeOrmModule.forFeature([Technology])],
})
export class TechnologiesModule {}
