import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @ApiProperty({
    example: 'senhaSegura123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  @Matches(/(?=.*[!@#$%^&*()\-_=+{};:,<.>])/, {
    message: 'A senha deve conter pelo menos um caractere especial.',
  })
  password: string;
}
