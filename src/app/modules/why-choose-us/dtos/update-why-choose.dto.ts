import { PartialType } from '@nestjs/swagger';
import { CreateWhyChooseDto } from './why-choose-us.dto';

export class UpdateWhyChooseDto extends PartialType(CreateWhyChooseDto) { }
