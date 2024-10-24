import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUUID } from "class-validator";
import { Video, Visibility } from "@prisma/client";

export class PatchMediaDto {
    @ApiProperty({ description: "Media title" })
    @IsString()
    title!: string;

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
}
