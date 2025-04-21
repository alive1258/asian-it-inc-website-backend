import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetFaqAnswerBaseDto {
  @IsString()
  @IsOptional()
  'question'?: string;

  @IsString()
  @IsOptional()
  'answer'?: string;

  @IsString()
  @IsOptional()
  'company_id'?: string;

  @IsString()
  @IsOptional()
  'faq_id'?: string;
}

export class GetFaqAnswerDto extends IntersectionType(
  GetFaqAnswerBaseDto,
  PaginationQueryDto,
) {}
