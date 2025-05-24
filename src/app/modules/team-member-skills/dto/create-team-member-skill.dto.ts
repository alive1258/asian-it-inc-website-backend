import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamMemberSkillDto {
  @ApiProperty({
    description: 'Team Member ID referencing the related team member.',
    example: '1',
  })
  @IsString({ message: 'Team Member ID must be a string.' })
  @IsNotEmpty({ message: 'Team Member ID is required.' })
  member_id: string;

  @ApiProperty({
    description: 'Skill ID referencing the related skill.',
    example: '5',
  })
  @IsString({ message: 'Skill ID must be a string.' })
  @IsNotEmpty({ message: 'Skill ID is required.' })
  skill_id: string;
}
