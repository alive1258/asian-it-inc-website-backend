import { PartialType } from '@nestjs/swagger';
import { CreateWorkFlowCategoryDto } from './create-work-flow-category.dto';

export class UpdateWorkFlowCategoryDto extends PartialType(CreateWorkFlowCategoryDto) {}
