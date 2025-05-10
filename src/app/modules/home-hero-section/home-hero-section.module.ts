import { Module } from '@nestjs/common';
import { HomeHeroSectionService } from './home-hero-section.service';
import { HomeHeroSectionController } from './home-hero-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeHeroSection } from './entities/home-hero-section.entity';

@Module({
  controllers: [HomeHeroSectionController],
  providers: [HomeHeroSectionService],
  imports: [TypeOrmModule.forFeature([HomeHeroSection])],
  exports: [HomeHeroSectionService],
})
export class HomeHeroSectionModule {}
