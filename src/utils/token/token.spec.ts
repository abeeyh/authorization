// token.service.spec.ts

import { TokenService } from './index';
import * as jwt from 'jsonwebtoken';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('token', () => {
    it('Should create a token', () => {
      const payload = { usuario: 'usuarioTeste' };
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'tokenMockado');

      const token = tokenService.tokenizer(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        expect.any(Object)
      );
      expect(token).toEqual('tokenMockado');
    });

    it('Should validade a token as a valid token', () => {
      const tokenMockado = 'tokenValido';
      jest
        .spyOn(jwt, 'verify')
        .mockImplementation(() => ({ usuario: 'usuarioTeste' }));

      const resultado = tokenService.verifyToken(tokenMockado);

      expect(jwt.verify).toHaveBeenCalledWith(tokenMockado, expect.any(String));
      expect(resultado).toEqual({ usuario: 'usuarioTeste' });
    });

    it('Should validade a token as a invalid token', () => {
      const tokenInvalido = 'tokenInvalido';
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Token inválido');
      });

      expect(() => tokenService.verifyToken(tokenInvalido)).toThrow(
        'Token inválido'
      );
    });
  });
});
