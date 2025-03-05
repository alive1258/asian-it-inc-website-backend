import { IntersectionType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

class GetPointsBaseDto {
  @IsInt()
  @IsNotEmpty()
  geofenceId: number;

  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  longitude: string;
}

export class GetPontDto extends IntersectionType(GetPointsBaseDto) {}
