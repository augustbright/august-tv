import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsPositive, Max } from "class-validator";

export class ImageCropDto {
    @ApiProperty({ description: "X-coordinate on the original image" })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10)
    @IsOptional()
    x!: number;

    @ApiProperty({ description: "Y-coordinate on the original image" })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10)
    @IsOptional()
    y!: number;

    @ApiProperty({ description: "Width of area on the original image to crop" })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10)
    @IsOptional()
    width!: number;

    @ApiProperty({
        description: "Height of area on the original image to crop",
    })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10)
    @IsOptional()
    height!: number;
}
