import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './utils/crypto';
import { PrismaModule } from './utils/prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/auth/auth.guard';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), UsersModule, AuthModule],
  controllers: [AppController, AppController],
  providers: [AppService, CryptoService],
})
export class AppModule {}
