import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class FindPostDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number;
}
