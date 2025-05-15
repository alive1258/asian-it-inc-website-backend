import { Module } from '@nestjs/common';
import { SnapshotsCategoryService } from './snapshots-category.service';
import { SnapshotsCategoryController } from './snapshots-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnapshotsCategory } from './entities/snapshots-category.entity';

@Module({
  controllers: [SnapshotsCategoryController],
  providers: [SnapshotsCategoryService],
  imports: [TypeOrmModule.forFeature([SnapshotsCategory])],
  exports: [SnapshotsCategoryService],
})
export class SnapshotsCategoryModule {}
