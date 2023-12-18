import { CryptoService } from './index';
import * as bcrypt from 'bcrypt';

describe('CriptografiaService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
  });

  it('Should return the password hash', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => Promise.resolve('hash'));
    const password = 'senha1234';
    const hash = await cryptoService.encrypt(password);
    expect(hash).toEqual('hash');
  });

  it('The password validation should be true.', async () => {
    const password = 'senha1234';
    const hash = await bcrypt.hash(password, 10);
    expect(await cryptoService.validate(password, hash)).toBeTruthy();
  });

  it('The password validation should be false.', async () => {
    const password = 'senha1234';
    expect(await cryptoService.validate(password, 'hashIncorreto')).toBeFalsy();
  });

  it('The password validation with the wrong password should be false.', async () => {
    const password = 'senha1234';
    const hashErrado = await bcrypt.hash('1234senha', 10);
    expect(await cryptoService.validate(password, hashErrado)).toBeFalsy();
  });
});
