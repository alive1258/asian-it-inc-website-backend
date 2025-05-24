import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Name(s) of the Skill(s).',
    example: ['Senior Software Engineer', 'Frontend Developer'],
    maxLength: 150,
  })
  @IsString({ each: true, message: 'Each name must be a string.' })
  @MaxLength(150, {
    each: true,
    message: 'Each name can contain a maximum of 150 characters.',
  })
  @IsNotEmpty()
  name: string;
}
