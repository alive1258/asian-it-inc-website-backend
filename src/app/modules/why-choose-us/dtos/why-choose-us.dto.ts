import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWhyChooseDto {
  @ApiProperty({
    description: 'The title of the reason for choosing us',
    example: 'High Quality Products',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'A detailed description explaining the reason',
    example: 'We offer only the best products sourced from trusted suppliers.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
