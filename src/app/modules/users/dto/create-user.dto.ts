import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  /**
   * First Name
   */
  @ApiProperty({
    description: 'First Name',
    example: 'Nayeem',
  })
  first_name: string;
}
