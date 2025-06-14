import { PartialType } from '@nestjs/swagger';
import { CreateWorkFlowDetailDto } from './create-work-flow-detail.dto';

export class UpdateWorkFlowDetailDto extends PartialType(CreateWorkFlowDetailDto) {}
