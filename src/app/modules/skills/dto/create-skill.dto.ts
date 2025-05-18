import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
  /**
   * Title of the skill
   */
  @ApiProperty({
    description: 'Title of the skill',
    example: 'JavaScript',
  })
  @IsString()
  @IsNotEmpty()
  skill_title: string;

  /**
   * Amount or level of the skill
   */
  @ApiProperty({
    description: 'Amount or level of the skill',
    example: 'Advanced',
  })
  @IsString()
  @IsNotEmpty()
  skill_amount: string;

  /**
   * Foreign key ID of the related skill category
   */
  @ApiProperty({
    description: 'ID of the related skill category',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  skills_category_id: string;
}
