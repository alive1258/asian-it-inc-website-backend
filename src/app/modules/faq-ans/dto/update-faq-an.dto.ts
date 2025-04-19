import { PartialType } from '@nestjs/swagger';
import { CreateFaqAnDto } from './create-faq-an.dto';

export class UpdateFaqAnDto extends PartialType(CreateFaqAnDto) {}
