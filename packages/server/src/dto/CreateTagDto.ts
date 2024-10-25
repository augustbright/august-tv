import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
    @ApiProperty({ description: "Name of the tag" })
    @IsString({})
    @MaxLength(30)
    @MinLength(1)
    name!: string;
}
