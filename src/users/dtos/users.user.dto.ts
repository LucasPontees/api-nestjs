import { IsNotEmpty } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
export class LoginUserDto {
  @ApiProperty({
    description: "The login of the user",
    example: "john.doe",
  })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  @IsNotEmpty()
  readonly password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "The name of the user",
    example: "John",
  })
  name: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "The surname of the user",
    example: "Doe",
  })
  surname: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "The login of the user",
    example: "john.doe",
  })
  login: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  @IsNotEmpty()
  password: string;
}
