import { Transform } from 'class-transformer';
import { IsString, IsInt } from 'class-validator';

export class CreatePricingDto {
  @IsString()
  package_name: string;

  @IsString()
  package_type: string;

  @IsInt()
  @Transform(({ value }) => parseFloat(value))
  price: number;
}
