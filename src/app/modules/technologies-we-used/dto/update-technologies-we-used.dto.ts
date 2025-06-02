import { PartialType } from '@nestjs/swagger';
import { CreateTechnologiesWeUsedDto } from './create-technologies-we-used.dto';

export class UpdateTechnologiesWeUsedDto extends PartialType(CreateTechnologiesWeUsedDto) {}
