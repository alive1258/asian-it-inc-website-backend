import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm';
export class CreateMemberDto {
  @IsInt()
  @Min(1, { message: 'user_id must be a positive integer' })
  user_id: number;

  @IsOptional() // Make status optional if it's not always required
  @IsInt()
  status?: number;

  @IsInt()
  @Min(1, { message: 'group_id must be a positive integer' })
  group_id: number;
}
