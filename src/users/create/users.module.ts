import { Module } from "@nestjs/common";
import { UsersService } from "@/users/create/users.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { UsersController } from "@/users/create/users.controller";
import { AuthService } from "@/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
@Module({
  imports: [],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthService, JwtService],
})
export class UsersModule {}
