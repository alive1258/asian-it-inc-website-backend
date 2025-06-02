import { Module } from '@nestjs/common';
import { PricingPlanFeaturesService } from './pricing-plan-features.service';
import { PricingPlanFeaturesController } from './pricing-plan-features.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingPlanFeature } from './entities/pricing-plan-feature.entity';

@Module({
  controllers: [PricingPlanFeaturesController],
  providers: [PricingPlanFeaturesService],
  exports: [PricingPlanFeaturesService],
  imports: [TypeOrmModule.forFeature([PricingPlanFeature])],
})
export class PricingPlanFeaturesModule {}
