import { Module } from '@nestjs/common';
import { WorkProcessGalleriesService } from './work-process-galleries.service';
import { WorkProcessGalleriesController } from './work-process-galleries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkProcessGallery } from './entities/work-process-gallery.entity';

@Module({
  controllers: [WorkProcessGalleriesController],
  providers: [WorkProcessGalleriesService],
  exports: [WorkProcessGalleriesService],
  imports: [TypeOrmModule.forFeature([WorkProcessGallery])],
})
export class WorkProcessGalleriesModule {}
