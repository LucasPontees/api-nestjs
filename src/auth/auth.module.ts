import { Module } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";
import { UsersModule } from "@/users/create/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@/auth/jwt.strategy";
import { AuthController } from "@/auth/auth.controller";
import { UsersService } from "@/users/create/users.service";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, PrismaService],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
