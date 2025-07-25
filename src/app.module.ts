import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/create/users.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
