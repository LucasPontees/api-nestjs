import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBody({
    type: SignUpDto,
    examples: {
      example1: {
        summary: 'Cadastro de usuário',
        value: {
          email: 'joao@example.com',
          password: '12345678',
          name: 'João da Silva',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @ApiBody({
    type: SignInDto,
    examples: {
      example1: {
        summary: 'Login de usuário',
        value: {
          email: 'joao@example.com',
          password: '12345678',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Retorna o token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }
}
