import { Module } from '@nestjs/common';
import { CollaboratingService } from './collaborating.service';
import { CollaboratingController } from './collaborating.controller';

@Module({
  controllers: [CollaboratingController],
  providers: [CollaboratingService],
})
export class CollaboratingModule {}
