import { Module } from '@nestjs/common';
import { WorkGalleryService } from './work-gallery.service';
import { WorkGalleryController } from './work-gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkGallery } from './entities/work-gallery.entity';

@Module({
  controllers: [WorkGalleryController],
  providers: [WorkGalleryService],
  imports: [TypeOrmModule.forFeature([WorkGallery])],
  exports: [WorkGalleryService],
})
export class WorkGalleryModule {}
