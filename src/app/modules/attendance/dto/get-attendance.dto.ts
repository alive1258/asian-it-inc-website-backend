import { IntersectionType } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

class GetAttendanceBaseDto {
  @IsInt()
  @IsNotEmpty()
  geofence_id: number;

  @IsInt()
  @IsNotEmpty()
  employee_id: number;

  @IsString()
  @IsNotEmpty()
  enter_time: string;

  @IsString()
  @IsNotEmpty()
  exit_time: string;
}

export class GetAttendanceDto extends IntersectionType(GetAttendanceBaseDto) {}
