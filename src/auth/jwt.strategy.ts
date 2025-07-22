import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const secret = process.env.SECRETKEY;
    if (!secret) {
      throw new Error(
        "JWT secret key (SECRETKEY) is not defined in environment variables"
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}

export interface JwtPayload {
  sub: string;
  login: string;
}
