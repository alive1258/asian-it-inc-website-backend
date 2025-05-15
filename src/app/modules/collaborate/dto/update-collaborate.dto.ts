import { PartialType } from '@nestjs/swagger';
import { CreateCollaborateDto } from './create-collaborate.dto';

export class UpdateCollaborateDto extends PartialType(CreateCollaborateDto) {}
