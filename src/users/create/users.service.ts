import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "@/users/dtos/users.user.dto";
import { compare, hash } from "bcrypt";
import { PrismaService } from "../../../prisma/prisma.service";
import { User } from "@prisma/client";

interface FormatLogin extends Partial<User> {
  login: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<any> {
    // // check if the user exists in the db
    const userInDb = await this.prisma.user.findFirst({
      where: { login: userDto.login },
    });
    if (userInDb) {
      throw new HttpException("user_already_exist", HttpStatus.CONFLICT);
    }
    return await this.prisma.user.create({
      data: {
        ...userDto,
        role: "CLIENT" as const,
        password: await hash(userDto.password, 10),
      },
    });
  }
  //use by auth module to login user
  async findByLogin({ login, password }: LoginUserDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      throw new HttpException("invalid_credentials", HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException("invalid_credentials", HttpStatus.UNAUTHORIZED);
    }

    const { password: p, ...rest } = user;
    return rest;
  }

  //use by auth module to get user in database
  async findByPayload({ login }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { login },
    });
  }
}
