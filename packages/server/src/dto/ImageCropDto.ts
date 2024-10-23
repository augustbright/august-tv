import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";
import { Type } from 'class-transformer';

export class ImageCropDto {
    @ApiProperty({ description: "X-coordinate on the original image" })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    x!: number;

    @ApiProperty({ description: "Y-coordinate on the original image" })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    y!: number;

    @ApiProperty({ description: "Width of area on the original image to crop" })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    width!: number;

    @ApiProperty({
        description: "Height of area on the original image to crop",
    })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    height!: number;
}
