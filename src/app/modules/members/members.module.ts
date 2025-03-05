import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from './entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [MembersService],
})
export class MembersModule {}
