import { Module } from '@nestjs/common';
import { GroupTypesService } from './group-types.service';
import { GroupTypesController } from './group-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupType } from './entities/group-type.entity';

@Module({
  controllers: [GroupTypesController],
  providers: [GroupTypesService],
  imports: [TypeOrmModule.forFeature([GroupType])],
  exports: [GroupTypesService],
})
export class GroupTypesModule {}
