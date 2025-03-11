import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { CreateDateColumn } from 'typeorm';
export class CreateMemberDto {
  @ApiPropertyOptional({
    description: 'User ID',
    example: 1,
  })
  @IsInt()
  @Min(1, { message: 'user_id must be a positive integer' })
  @IsOptional()
  user_id?: number;

  @ApiPropertyOptional({
    description: 'status',
    example: 1,
  })
  @IsOptional() // Make status optional if it's not always required
  @IsInt()
  status?: number;

  @IsInt()
  @Min(1, { message: 'group_id must be a positive integer' })
  group_id: number;
}
