import { Module } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { DesignationsController } from './designations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';

@Module({
  controllers: [DesignationsController],
  providers: [DesignationsService],
  imports: [TypeOrmModule.forFeature([Designation])],
  exports: [DesignationsService],
})
export class DesignationsModule {}
