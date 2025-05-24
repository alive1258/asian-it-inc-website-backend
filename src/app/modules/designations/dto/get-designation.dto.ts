import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
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

  @ApiProperty({
    description: 'Status indicating whether the designation is active.',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value (true or false).' })
  @IsNotEmpty({ message: 'Status must not be empty.' })
  status?: boolean;
}

export class GetDesignationDto extends IntersectionType(
  GetDesignationBaseDto,
  PaginationQueryDto,
) {}
