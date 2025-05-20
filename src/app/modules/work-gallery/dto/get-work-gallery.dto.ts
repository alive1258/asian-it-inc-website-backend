import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetWorkGalleryBaseDto {
  @ApiPropertyOptional({
    description: 'Search by title of the hero section.',
    example: 'Empowering the Next Generation of Tech Innovators',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Whether to include description field in response.',
    example: true,
  })
  @IsString()
  @IsOptional()
  photo?: string;
}

export class GetWorkGalleryDto extends IntersectionType(
  GetWorkGalleryBaseDto,
  PaginationQueryDto,
) {}
