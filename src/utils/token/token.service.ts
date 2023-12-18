import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly secret = process.env.JWT_SECRET || 'umachavequalquer';

  tokenizer(payload: string | object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '60m' });
  }

  verifyToken(token: string): jwt.JwtPayload | string {
    try {
      return jwt.verify(token, this.secret);
    } catch (e) {
      throw new Error('Token inválido');
    }
  }
}
