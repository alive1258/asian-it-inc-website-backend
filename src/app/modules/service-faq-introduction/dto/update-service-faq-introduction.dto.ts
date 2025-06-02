import { PartialType } from '@nestjs/swagger';
import { CreateServiceFaqIntroductionDto } from './create-service-faq-introduction.dto';

export class UpdateServiceFaqIntroductionDto extends PartialType(CreateServiceFaqIntroductionDto) {}
