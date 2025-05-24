import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetTeamMemberBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by the name of the team member.',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by the slug of the team member.',
    example: 'john-doe',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by the photo URL or filename of the team member.',
    example: 'john-doe.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Photo must be a string.' })
  photo?: string;

  @ApiPropertyOptional({
    description: 'Filter by the biography of the team member.',
    example: 'Senior developer with 10 years of experience.',
  })
  @IsOptional()
  @IsString({ message: 'Biography must be a string.' })
  biography?: string;

  @ApiPropertyOptional({
    description: 'Filter by the designation ID.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'Designation ID must be a string.' })
  designation_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by the designation status.',
    example: '1',
  })
  @IsOptional()
  @IsString({ message: 'Designation status must be a string.' })
  'designation.status'?: string;
}

export class GetTeamMemberDto extends IntersectionType(
  GetTeamMemberBaseDto,
  PaginationQueryDto,
) {}
