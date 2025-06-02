import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePricingPlanFeatureDto {
  @ApiProperty({
    description: 'ID of the service the price plan is related to',
    example: 'service_67890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  service_id: string;

  @ApiProperty({
    description: 'ID of the plan type associated with the pricing',
    example: 'plan_type_basic',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  pricing_plan_id: string;

  @ApiProperty({
    description: 'Headline or short description of the pricing plan',
    example: 'Perfect for startups',
  })
  @IsString()
  @IsNotEmpty()
  benefit: string;
}
