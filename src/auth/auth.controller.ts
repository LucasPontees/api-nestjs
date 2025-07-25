import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";
import { LoginUserDto } from "@/users/dtos/users.user.dto";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { Authorization, expiresIn, data } =
      await this.authService.login(loginUserDto);

    res.cookie("auth-token", Authorization, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      //1 minute
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });

    return {
      message: "Login realizado com sucesso",
      data,
      token: Authorization,
    };
  }
}
