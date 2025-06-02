import { PartialType } from '@nestjs/swagger';
import { CreatePricingPlanDto } from './create-pricing-plan.dto';

export class UpdatePricingPlanDto extends PartialType(CreatePricingPlanDto) {}
