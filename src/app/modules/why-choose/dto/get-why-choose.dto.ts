import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetWhyChooseBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by headline of the Why Choose entry.',
    example: 'Fast & Reliable Services',
  })
  @IsOptional()
  @IsString({ message: 'Headline must be a string.' })
  headline?: string;

  @ApiPropertyOptional({
    description: 'Filter by description of the Why Choose entry.',
    example: 'We provide fast and reliable services for our clients.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;
}

export class GetWhyChooseDto extends IntersectionType(
  GetWhyChooseBaseDto,
  PaginationQueryDto,
) {}
