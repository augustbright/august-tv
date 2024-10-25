import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsIn,
    IsInt,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
import { Video, Visibility } from "@prisma/client";

export class PatchMediaDto {
    @ApiProperty({ description: "Media title" })
    @IsString()
    title!: string;

    @ApiProperty({ description: "Category" })
    @IsNumber()
    @IsOptional()
    category?: number;

    @ApiProperty({ description: "Media description" })
    @IsString()
    description!: string;

    @ApiProperty({ description: "Media visibility" })
    @IsString()
    @IsIn(Object.keys(Visibility))
    visibility!: Video["visibility"];

    @ApiProperty({ description: "Media thumbnail image id" })
    @IsString()
    @IsUUID()
    @IsOptional()
    thumbnailImageId?: string;

    @ApiProperty({ description: "Tags ids" })
    @IsArray({})
    @IsInt({ each: true })
    @IsOptional()
    tags?: number[];
}
