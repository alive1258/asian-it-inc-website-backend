import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty({
    description: 'Name of the designation or job title.',
    example: 'Senior Software Engineer',
    maxLength: 150,
  })
  @IsString({ message: 'Name must be a string.' })
  @MaxLength(150, { message: 'Name can contain a maximum of 150 characters.' })
  name: string;

  @ApiProperty({
    description: 'Status indicating whether the designation is active.',
    example: true,
  })
  @IsBoolean({ message: 'Status must be a boolean value (true or false).' })
  status: boolean;
}
