import { IsInt, IsOptional, Min } from 'class-validator';
export class UpdateMemberDto {
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'user_id must be a positive integer' })
  user_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'group_id must be a positive integer' })
  group_id?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'status must be 0 (inactive) or 1 (active)' })
  status?: number;
}
