import { PartialType } from '@nestjs/swagger';
import { CreateWhyChooseDto } from './create-why-choose.dto';

export class UpdateWhyChooseDto extends PartialType(CreateWhyChooseDto) {}
