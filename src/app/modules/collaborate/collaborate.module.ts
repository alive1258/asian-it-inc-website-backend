import { Module } from '@nestjs/common';
import { CollaborateService } from './collaborate.service';
import { CollaborateController } from './collaborate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborate } from './entities/collaborate.entity';

@Module({
  controllers: [CollaborateController],
  providers: [CollaborateService],
  imports: [TypeOrmModule.forFeature([Collaborate])],
  exports: [TypeOrmModule],
})
export class CollaborateModule {}
