import { Module } from '@nestjs/common';
import { ExtraCurriculumService } from './extra-curriculum.service';
import { ExtraCurriculumController } from './extra-curriculum.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraCurriculum } from './entities/extra-curriculum.entity';

@Module({
  controllers: [ExtraCurriculumController],
  providers: [ExtraCurriculumService],
  imports: [TypeOrmModule.forFeature([ExtraCurriculum])],
  exports: [ExtraCurriculumService],
})
export class ExtraCurriculumModule {}
