import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetSkillsBaseDto {
  @ApiPropertyOptional({
    description: 'Name of the Skills or job title.',
    example: ['Senior Software Engineer', 'Frontend Developer'],
  })
  @IsOptional()
  @IsString({ each: true, message: 'Each name must be a string.' })
  @IsNotEmpty({ each: true, message: 'Each name must not be empty.' })
  name?: string;
}

export class GetSkillsDto extends IntersectionType(
  GetSkillsBaseDto,
  PaginationQueryDto,
) {}
