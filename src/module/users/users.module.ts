import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenService } from '../../utils/token';
import { CryptoService } from '../../utils/crypto';
import { AuthGuard } from '../../core/auth/auth.guard';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CryptoService, TokenService, AuthGuard],
})
export class UsersModule {}
