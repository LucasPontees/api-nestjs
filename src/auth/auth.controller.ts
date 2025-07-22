import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService, RegistrationStatus } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "./dto/users.user.dto";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus =
      await this.authService.register(createUserDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post("login")
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<any> {
    const tokenData = await this.authService.login(loginUserDto);

    res.cookie("auth_token", tokenData.access_token, {
      httpOnly: true,
      secure: true, // use HTTPS em produção
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });

    return {
      message: "Login realizado com sucesso",
      tipoEmpresa: tokenData.tipoEmpresa, // se você quiser retornar mais dados
    };
  }
}
