import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { UsersService } from '../../module/users/users.service';
import { TokenService, CryptoService } from '../../utils/services';
import { User } from '../../module/users/entities/user.entity';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';

@Injectable()
export class AuthService {
  private tokenService: TokenService;
  private cryptoService: CryptoService;
  private userService: UsersService;

  constructor(
    tokenService: TokenService,
    cryptoService: CryptoService,
    usersService: UsersService
  ) {
    this.tokenService = tokenService;
    this.cryptoService = cryptoService;
    this.userService = usersService;
  }

  async generateToken(user: any): Promise<any> {
    let result = await this.userService.login(user);

    if (typeof result === 'object' && result !== null) {
      const foundUser = result as User;

      const payload = {
        username: foundUser.name,
        sub: foundUser.id,
        email: foundUser.email,
      };

      return {
        access_token: this.tokenService.tokenizer(payload),
      };
    } else {
      throw new Error(ErrorMessages.UserNotFound);
    }
  }

  async refreshToken(token: string): Promise<any> {
    try {
      const decoded = this.tokenService.verifyToken(token) as JwtPayload;
      const { exp, iat, aud, ...restOfDecoded } = decoded;

      return {
        access_token: this.tokenService.tokenizer(restOfDecoded),
      };
    } catch (error) {
      throw new Error(ErrorMessages.InvalidOrExpiredKey);
    }
  }
}
