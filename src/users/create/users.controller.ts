import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "../dtos/users.user.dto";
import { AuthService, RegistrationStatus } from "src/auth/auth.service";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post("create")
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus =
      await this.authService.register(createUserDto);
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
