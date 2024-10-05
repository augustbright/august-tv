import { IsString, IsOptional } from 'class-validator';

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsOptional()
  publish: boolean;
}
