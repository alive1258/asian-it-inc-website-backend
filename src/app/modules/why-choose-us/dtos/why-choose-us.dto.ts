import { ApiProperty } from '@nestjs/swagger';

export class CreateWhyChooseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
