import { PartialType } from '@nestjs/swagger';
import { CreateExtraCurriculumDto } from './create-extra-curriculum.dto';

export class UpdateExtraCurriculumDto extends PartialType(CreateExtraCurriculumDto) {}
