import { Transform } from 'class-transformer';
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(3)
  package_type: number; // Assuming 1, 2, or 3 are valid package types

  @Min(0)
  @Transform(({ value }) => parseFloat(value)) // Transform string to float
  point: number;

  @IsInt()
  @Min(0)
  family_group: number;

  @IsInt()
  @Min(0)
  circle_group: number;

  @IsInt()
  @Min(0)
  family_group_member: number;

  @IsInt()
  @Min(0)
  circle_group_member: number;

  @IsInt()
  @Min(0)
  wywtm_member: number;

  @IsInt()
  @Min(0)
  family_group_total_tracking: number;

  @IsInt()
  @Min(0)
  circle_group_total_tracking: number;

  @IsInt()
  @Min(0)
  wywtm_total_tracking: number;
}
