import { Module } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';

@Module({
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
  imports: [TypeOrmModule.forFeature([Professor])],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}
