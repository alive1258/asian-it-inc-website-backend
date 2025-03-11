import { IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsInt, IsDate, Min, Max, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetPackagesBaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  package_type?: number; // Assuming 1, 2, or 3 are valid package types

  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value)) // Transform string to float
  point?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  family_group?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  circle_group?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  family_group_member?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  circle_group_member?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  wywtm_member?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  family_group_total_tracking?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  circle_group_total_tracking?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  wywtm_total_tracking?: number;
}

export class GetPackagesDto extends IntersectionType(
  GetPackagesBaseDto,
  PaginationQueryDto,
) {}
