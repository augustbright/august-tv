import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UserCredentialsDto {
    @ApiProperty({ description: "Email" })
    @IsString()
    @MaxLength(100)
    @MinLength(1)
    email!: string;

    @ApiProperty({ description: "Password" })
    @IsString()
    @MaxLength(100)
    @MinLength(1)
    password!: string;
}
