import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CnpjModule } from './cnpj/cnpj.module';

@Module({
  imports: [
    // Serve arquivos da pasta /uploads via rota /uploads
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    CnpjModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
