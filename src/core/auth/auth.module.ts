import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService, TokenService } from '../../utils/services';
import { UsersService } from '../../module/users/users.service';

@Module({
  controllers: [AuthController],
  exports: [TokenService],
  providers: [AuthService, TokenService, CryptoService, UsersService],
})
export class AuthModule {}
