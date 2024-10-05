import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SessionLoginDto {
  @ApiProperty({ description: 'Firebase ID Token' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
