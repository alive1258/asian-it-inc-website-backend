import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetDesignationBaseDto {
  @ApiPropertyOptional({
    description: 'Name of the designation or job title.',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name must not be empty.' })
  name?: string;
}

export class GetDesignationDto extends IntersectionType(
  GetDesignationBaseDto,
  PaginationQueryDto,
) {}
