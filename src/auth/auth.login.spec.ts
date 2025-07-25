import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "src/users/dtos/users.user.dto";
import { PrismaService } from "prisma/prisma.service";

describe("AuthService - login()", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {} as any;
    usersService = {
      findByLogin: vi.fn(),
    } as any;

    jwtService = {
      sign: vi.fn().mockReturnValue("fake-jwt-token"),
    } as any;

    authService = new AuthService(prismaService, jwtService, usersService);
    vi.spyOn(authService as any, "_createToken").mockReturnValue({
      accessToken: "fake-token",
      expiresIn: 3600,
    });
  });

  it("deve retornar token e dados do usuário ao fazer login", async () => {
    const loginDto: LoginUserDto = { login: "teste", password: "123456" };
    const fakeUser = { id: 1, login: "teste" };

    (usersService.findByLogin as any).mockResolvedValue(fakeUser);

    const result = await authService.login(loginDto);

    expect(usersService.findByLogin).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual({
      accessToken: "fake-token",
      expiresIn: 3600,
      data: fakeUser,
    });
  });

  it("deve propagar erro se findByLogin lançar exceção", async () => {
    const loginDto = { login: "teste", password: "errado" };
    (usersService.findByLogin as any).mockRejectedValue(new Error("Invalid"));

    await expect(() => authService.login(loginDto)).rejects.toThrow("Invalid");
  });
});
