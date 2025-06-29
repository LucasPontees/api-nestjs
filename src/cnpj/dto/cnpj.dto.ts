// cnpj.dto.ts
import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CnpjDto {
  @ApiProperty({
    description:
      'CNPJ de 14 dígitos numéricos. Pontos, barra e hífen serão ignorados.',
    example: '56.109.124/0001-64',
  })
  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : value))
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve conter 14 dígitos numéricos' })
  @Matches(/^\d+$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;
}
