import { PartialType } from '@nestjs/swagger';
import { CreateGroupTypeDto } from './create-group-type.dto';

export class UpdateGroupTypeDto extends PartialType(CreateGroupTypeDto) {}
