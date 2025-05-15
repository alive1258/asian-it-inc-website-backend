import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollaborateDto {
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Name of the educational institute.',
    example: 'Bangladesh University of    and Technology (BUET)',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
