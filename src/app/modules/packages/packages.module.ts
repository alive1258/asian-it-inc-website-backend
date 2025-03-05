import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Packages } from './entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService],
  imports: [TypeOrmModule.forFeature([Packages])],
  exports: [PackagesService],
})
export class PackagesModule {}
