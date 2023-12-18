import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly saltOrRounds = 10;

  async encrypt(input: string): Promise<string> {
    return bcrypt.hash(input, this.saltOrRounds);
  }

  async validate(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
