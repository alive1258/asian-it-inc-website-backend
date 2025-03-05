import { IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsDate } from 'class-validator';

class GetGroupBaseDto {
  @IsString()
  name: string;

  @IsInt()
  group_type_id: number; // ID reference to GroupType

  @Type(() => Date)
  @IsDate()
  check_in_time: Date;

  @Type(() => Date)
  @IsDate()
  check_out_time: Date;
}
export class UpdateGroupDto {
  @IsString()
  name?: string;

  @IsInt()
  group_type_id?: number; // ID reference to GroupType

  @Type(() => Date)
  @IsDate()
  check_in_time?: Date;

  @Type(() => Date)
  @IsDate()
  check_out_time?: Date;
}

export class GetGroupDto extends IntersectionType(GetGroupBaseDto) {}
