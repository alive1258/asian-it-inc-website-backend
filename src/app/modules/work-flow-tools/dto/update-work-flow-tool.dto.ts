import { PartialType } from '@nestjs/swagger';
import { CreateWorkFlowToolDto } from './create-work-flow-tool.dto';

export class UpdateWorkFlowToolDto extends PartialType(CreateWorkFlowToolDto) {}
