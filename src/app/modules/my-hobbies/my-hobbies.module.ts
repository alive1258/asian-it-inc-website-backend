import { Module } from '@nestjs/common';
import { MyHobbiesService } from './my-hobbies.service';
import { MyHobbiesController } from './my-hobbies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyHobby } from './entities/my-hobby.entity';

@Module({
  controllers: [MyHobbiesController],
  providers: [MyHobbiesService],
  imports: [TypeOrmModule.forFeature([MyHobby])],
  exports: [MyHobbiesService],
})
export class MyHobbiesModule {}
