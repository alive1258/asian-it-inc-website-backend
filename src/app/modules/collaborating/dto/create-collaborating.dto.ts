import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCollaboratingDto {
  @ApiProperty({
    description: 'Name of the faculty or department.',
    example: 'Faculty of Engineering',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Email address of the collaborating person or institute.',
    example: 'contact@buet.edu.bd',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the collaborating entity.',
    example: '+8801712345678',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Website or LinkedIn profile link.',
    example: 'https://www.linkedin.com/in/example-profile',
  })
  @IsUrl()
  @IsNotEmpty()
  linked_link: string;

  @ApiProperty({
    description: 'Location of the collaborating institute or department.',
    example: 'Dhaka, Bangladesh',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
