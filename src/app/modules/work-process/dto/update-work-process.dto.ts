import { PartialType } from '@nestjs/swagger';
import { CreateWorkProcessDto } from './create-work-process.dto';

export class UpdateWorkProcessDto extends PartialType(CreateWorkProcessDto) {}
