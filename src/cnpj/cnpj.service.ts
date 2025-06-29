// cnpj.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CnpjService {
  constructor(private readonly http: HttpService) {}

  async consultarCnpj(cnpj: string): Promise<any> {
    const sanitized = cnpj.replace(/\D/g, '');

    if (sanitized.length !== 14) {
      throw new BadRequestException('CNPJ inválido – deve conter 14 dígitos');
    }

    const url = `https://brasilapi.com.br/api/cnpj/v1/${sanitized}`;

    try {
      const response = await lastValueFrom(this.http.get(url));
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new BadRequestException('CNPJ inválido');
      }

      throw new BadRequestException('Erro ao consultar CNPJ');
    }
  }
}
