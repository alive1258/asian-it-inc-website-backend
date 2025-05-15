import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Snapshot } from './entities/snapshot.entity';

@Module({
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  imports: [TypeOrmModule.forFeature([Snapshot])],
  exports: [SnapshotsService],
})
export class SnapshotsModule {}
