import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsUrl } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

/**
 * DTO for filtering collaborating records.
 */
class GetCollaboratingBaseDto {
  @ApiPropertyOptional({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Email address of the collaborating person or institute.',
    example: 'contact@buet.edu.bd',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the collaborating entity.',
    example: '+8801712345678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Website or LinkedIn profile link.',
    example: 'https://www.linkedin.com/in/example-profile',
  })
  @IsUrl()
  @IsOptional()
  linked_link?: string;

  @ApiPropertyOptional({
    description: 'Location of the collaborating institute or department.',
    example: 'Dhaka, Bangladesh',
  })
  @IsString()
  @IsOptional()
  location?: string;
}

/**
 * DTO for retrieving Collaborating data with filters and pagination.
 */
export class GetCollaboratingDto extends IntersectionType(
  GetCollaboratingBaseDto,
  PaginationQueryDto,
) {}
