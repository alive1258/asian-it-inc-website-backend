import { IntersectionType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

class GetGroupTypeBaseDto {
  @IsString()
  @MaxLength(255)
  name: string;
}

export class GetGroupTypeDto extends IntersectionType(GetGroupTypeBaseDto) {}
