import { IsString, MaxLength } from 'class-validator';
export class CreateGroupTypeDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
