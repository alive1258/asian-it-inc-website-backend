import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

class GetUsersBaseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetUsersDto extends IntersectionType(GetUsersBaseDto) {}
