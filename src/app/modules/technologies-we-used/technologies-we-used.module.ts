import { Module } from '@nestjs/common';
import { TechnologiesWeUsedService } from './technologies-we-used.service';
import { TechnologiesWeUsedController } from './technologies-we-used.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesWeUsed } from './entities/technologies-we-used.entity';

@Module({
  controllers: [TechnologiesWeUsedController],
  providers: [TechnologiesWeUsedService],
  exports: [TechnologiesWeUsedService],
  imports: [TypeOrmModule.forFeature([TechnologiesWeUsed])],
})
export class TechnologiesWeUsedModule {}
