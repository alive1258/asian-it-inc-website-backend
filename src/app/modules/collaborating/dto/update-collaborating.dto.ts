import { PartialType } from '@nestjs/swagger';
import { CreateCollaboratingDto } from './create-collaborating.dto';

export class UpdateCollaboratingDto extends PartialType(CreateCollaboratingDto) {}
