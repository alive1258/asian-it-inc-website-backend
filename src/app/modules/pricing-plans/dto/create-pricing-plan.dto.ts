import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreatePricingPlanDto {
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
  plan_type_id: string;

  @ApiProperty({
    description: 'Discounted price of the plan',
    example: 99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Regular price of the plan before discount',
    example: 149,
  })
  @IsNumber()
  @IsNotEmpty()
  regular_price: number;

  @ApiProperty({
    description: 'Headline or short description of the pricing plan',
    example: 'Perfect for startups',
  })
  @IsString()
  @IsNotEmpty()
  headline: string;

  @ApiProperty({
    description:
      'Indicates whether the plan is monthly (true) or yearly (false)',
    example: true,
  })
  @IsBoolean({ message: 'is_monthly must be a boolean value (true or false).' })
  @IsNotEmpty()
  is_monthly: boolean;
}
