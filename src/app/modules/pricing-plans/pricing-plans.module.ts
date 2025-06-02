import { Module } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { PricingPlansController } from './pricing-plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingPlan } from './entities/pricing-plan.entity';

@Module({
  controllers: [PricingPlansController],
  providers: [PricingPlansService],
  exports: [PricingPlansService],
  imports: [TypeOrmModule.forFeature([PricingPlan])],
})
export class PricingPlansModule {}
