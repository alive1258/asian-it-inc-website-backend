import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateAttendanceDto {
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

  @IsInt()
  @IsNotEmpty()
  notification_type: number;
}
