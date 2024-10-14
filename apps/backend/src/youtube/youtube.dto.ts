import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export namespace PostImportFromYoutube {
  export class Body {
    @ApiProperty({ description: 'Id of user to set as author' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    authorId!: string;

    @ApiProperty({ description: 'Youtube channel id (Optional)' })
    @IsString()
    @MaxLength(255)
    @IsOptional()
    channelId?: string;

    @ApiProperty({ description: 'Youtube video id (Optional)' })
    @IsString()
    @MaxLength(255)
    @IsOptional()
    videoId?: string;

    @ApiProperty({ description: 'Number of videos to import (Optional)' })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10)
    @IsOptional()
    numberOfVideos?: number;

    @ApiProperty({ description: 'Publish videos immediately (Optional)' })
    @IsBoolean()
    @IsOptional()
    publicImmediately?: boolean;

    @ApiProperty({
      description: 'A list of user ids who need to observe the job',
    })
    @IsString({ each: true })
    @MaxLength(255, { each: true })
    @IsNotEmpty({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    observers!: string[];
  }
}
