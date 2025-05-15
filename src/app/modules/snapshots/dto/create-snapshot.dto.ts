import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSnapshotDto {
  /**
   * Optional photo filename (e.g., a snapshot image)
   */
  @ApiPropertyOptional({
    description: 'Snapshot photo filename',
    example: 'snapshot-photo.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  /**
   * Required foreign key ID of the related snapshot category
   */
  @ApiProperty({
    description: 'ID of the related snapshot category',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  snapshots_category_id: string;
}
