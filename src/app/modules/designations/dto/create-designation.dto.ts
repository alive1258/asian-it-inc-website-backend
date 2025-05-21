import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty({
    description: 'Name of the designation or job title.',
    example: 'Senior Software Engineer',
    maxLength: 350,
  })
  @IsString({ message: 'Name must be a string.' })
  @IsOptional()
  @MaxLength(350, { message: 'Name can contain a maximum of 150 characters.' })
  name: string;
}
