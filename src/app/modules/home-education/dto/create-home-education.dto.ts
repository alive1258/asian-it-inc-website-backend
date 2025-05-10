import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHomeEducationDto {
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  faculty_name: string;

  @ApiProperty({
    description: 'Name of the educational institute.',
    example: 'Bangladesh University of Engineering and Technology (BUET)',
  })
  @IsString()
  @IsNotEmpty()
  institute_name: string;

  @ApiProperty({
    description: 'Academic session or year range.',
    example: '2018-2019',
  })
  @IsString()
  @IsNotEmpty()
  session: string;

  @ApiProperty({
    description: 'Result or grade obtained.',
    example: 'First Class',
  })
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty({
    description: 'Subject or major being studied.',
    example: 'Computer Science and Engineering',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}
