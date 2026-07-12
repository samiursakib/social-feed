import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsIn } from 'class-validator';

export class FindPostsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}
