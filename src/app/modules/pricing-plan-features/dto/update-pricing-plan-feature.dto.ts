import { PartialType } from '@nestjs/swagger';
import { CreatePricingPlanFeatureDto } from './create-pricing-plan-feature.dto';

export class UpdatePricingPlanFeatureDto extends PartialType(CreatePricingPlanFeatureDto) {}
