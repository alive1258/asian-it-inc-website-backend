import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetFaqBaseDto {
  @IsString()
  @IsOptional()
  'headline'?: string;

  @IsString()
  @IsOptional()
  'photo'?: string;
}

export class GetFaqDto extends IntersectionType(
  GetFaqBaseDto,
  PaginationQueryDto,
) {}
