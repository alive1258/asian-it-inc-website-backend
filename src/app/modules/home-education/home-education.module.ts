import { Module } from '@nestjs/common';
import { HomeEducationService } from './home-education.service';
import { HomeEducationController } from './home-education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeEducation } from './entities/home-education.entity';

@Module({
  controllers: [HomeEducationController],
  providers: [HomeEducationService],
  imports: [TypeOrmModule.forFeature([HomeEducation])],
  exports: [HomeEducationService],
})
export class HomeEducationModule {}
