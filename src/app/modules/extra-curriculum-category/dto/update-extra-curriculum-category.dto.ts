import { PartialType } from '@nestjs/swagger';
import { CreateExtraCurriculumCategoryDto } from './create-extra-curriculum-category.dto';

export class UpdateExtraCurriculumCategoryDto extends PartialType(CreateExtraCurriculumCategoryDto) {}
