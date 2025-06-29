// cnpj.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CnpjService } from './cnpj.service';
import { CnpjDto } from './dto/cnpj.dto';

@Controller('cnpj')
export class CnpjController {
  constructor(private readonly cnpjService: CnpjService) {}

  @Get(':cnpj')
  async getCnpj(@Param() params: CnpjDto) {
    return await this.cnpjService.consultarCnpj(params.cnpj);
  }
}
