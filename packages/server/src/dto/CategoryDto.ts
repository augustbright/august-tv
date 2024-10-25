import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CategoryDto {
    @ApiProperty({ description: "Name of the category" })
    @IsString({})
    @MaxLength(30)
    @MinLength(1)
    name!: string;
}
