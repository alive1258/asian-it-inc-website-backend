import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * DTO for filtering home education records.
 */
class GetHomeEducationFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by faculty or department name.',
    example: 'Faculty of Science',
  })
  @IsOptional()
  @IsString()
  faculty_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by name of the educational institute.',
    example: 'Dhaka University',
  })
  @IsOptional()
  @IsString()
  institute_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by academic session.',
    example: '2019-2020',
  })
  @IsOptional()
  @IsString()
  session?: string;

  @ApiPropertyOptional({
    description: 'Filter by result or grade.',
    example: 'First Class',
  })
  @IsOptional()
  @IsString()
  result?: string;

  @ApiPropertyOptional({
    description: 'Filter by subject or major.',
    example: 'Physics',
  })
  @IsOptional()
  @IsString()
  subject?: string;
}

/**
 * DTO for retrieving home education data with filters and pagination.
 */
export class GetHomeEducationDto extends IntersectionType(
  GetHomeEducationFilterDto,
  PaginationQueryDto,
) {}
