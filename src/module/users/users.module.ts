import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenService } from 'src/utils/token';
import { CryptoService } from 'src/utils/crypto';
import { AuthGuard } from 'src/core/auth/auth.guard';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CryptoService, TokenService, AuthGuard],
})
export class UsersModule {}
