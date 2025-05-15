import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/app/common/data-query/dto/data-query.dto';

class GetSnapshotBaseDto {
  @ApiPropertyOptional({
    description: 'Snapshot photo filename',
    example: 'snapshot-photo.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional({
    description: 'ID of the related snapshot category',
    example: '1',
  })
  @IsString()
  @IsOptional()
  snapshots_category_id?: string;
}

export class GetSnapshotDto extends IntersectionType(
  GetSnapshotBaseDto,
  PaginationQueryDto,
) {}
