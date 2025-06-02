import { PartialType } from '@nestjs/swagger';
import { CreateWorkFlowDto } from './create-work-flow.dto';

export class UpdateWorkFlowDto extends PartialType(CreateWorkFlowDto) {}
