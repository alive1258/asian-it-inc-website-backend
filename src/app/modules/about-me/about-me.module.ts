import { Module } from '@nestjs/common';
import { AboutMeService } from './about-me.service';
import { AboutMeController } from './about-me.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMe } from './entities/about-me.entity';

@Module({
  controllers: [AboutMeController],
  providers: [AboutMeService],
  imports: [TypeOrmModule.forFeature([AboutMe])],
  exports: [AboutMeService],
})
export class AboutMeModule {}
