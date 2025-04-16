import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetPricingBaseDto {
  @IsString()
  @IsOptional()
  package_name?: string;

  @IsString()
  @IsOptional()
  package_type?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price?: number;
}

export class GetPricingDto extends IntersectionType(
  GetPricingBaseDto,
  PaginationQueryDto,
) {}
