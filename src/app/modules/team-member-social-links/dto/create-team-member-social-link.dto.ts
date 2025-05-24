import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateTeamMemberSocialLinkDto {
  @ApiProperty({
    description: 'The ID of the team member associated with this social link.',
    example: '1a2b3c',
  })
  @IsString({ message: 'Team member ID must be a string.' })
  @IsNotEmpty({ message: 'Team member ID is required.' })
  member_id: string;

  @ApiProperty({
    description: 'The ID of the social site (e.g., Facebook, Twitter, etc.).',
    example: 'facebook',
  })
  @IsString({ message: 'Social site ID must be a string.' })
  @IsNotEmpty({ message: 'Social site ID is required.' })
  social_site_id: string;

  @ApiProperty({
    description: 'The full URL of the social profile.',
    example: 'https://facebook.com/username',
  })
  @IsUrl({}, { message: 'Please provide a valid URL.' })
  @IsNotEmpty({ message: 'URL is required.' })
  url: string;
}
