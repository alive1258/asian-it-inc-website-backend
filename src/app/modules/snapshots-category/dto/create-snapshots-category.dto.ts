import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSnapshotsCategoryDto {
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
