import { Module } from '@nestjs/common';
import { CnpjController } from './cnpj.controller';
import { CnpjService } from './cnpj.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CnpjController],
  providers: [CnpjService],
})
export class CnpjModule {}
