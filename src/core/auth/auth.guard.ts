import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../utils/services';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthGuard {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<string | JwtPayload> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException(
          ErrorMessages.AuthorizationHeaderMissing
        );
      }

      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        throw new UnauthorizedException(ErrorMessages.BearerTokenMissing);
      }

      return await this.tokenService.verifyToken(token);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        throw new UnauthorizedException(ErrorMessages.InvalidCredentials);
      } else {
        throw error;
      }
    }
  }
}
