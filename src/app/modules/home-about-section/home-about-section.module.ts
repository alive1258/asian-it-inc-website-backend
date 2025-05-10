import { Module } from '@nestjs/common';
import { HomeAboutSectionService } from './home-about-section.service';
import { HomeAboutSectionController } from './home-about-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeAboutSection } from './entities/home-about-section.entity';

@Module({
  controllers: [HomeAboutSectionController],
  providers: [HomeAboutSectionService],
  imports: [TypeOrmModule.forFeature([HomeAboutSection])],
  exports: [HomeAboutSectionService],
})
export class HomeAboutSectionModule {}
