import { AuthService } from './auth.service';
import { TokenService, CryptoService } from '../../utils/services';
import { UsersService } from '../../module/users/users.service';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';
import { usersMock } from '../../../mocked/users';

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let cryptoService: CryptoService;
  let usersService: UsersService;

  beforeEach(() => {
    tokenService = new TokenService();
    cryptoService = new CryptoService();
    usersService = new UsersService(cryptoService, tokenService);
    authService = new AuthService(tokenService, cryptoService, usersService);
  });

  it('should generate a token for a valid user', async () => {
    usersService.login = jest.fn().mockResolvedValue(usersMock.default.user);
    tokenService.tokenizer = jest.fn().mockReturnValue('token');

    const result = await authService.generateToken({
      username: 'TestUser',
      password: 'password',
    });
    expect(result).toHaveProperty('access_token');
  });

  it('should throw an error if user is not found', async () => {
    usersService.login = jest.fn().mockResolvedValue(null);
    await expect(
      authService.generateToken({
        username: 'TestUser',
        password: 'password',
      })
    ).rejects.toThrow(ErrorMessages.UserNotFound);
  });

  it('should refresh token successfully', async () => {
    const decodedToken = { username: 'TestUser', sub: '123' };
    tokenService.verifyToken = jest.fn().mockReturnValue(decodedToken);
    tokenService.tokenizer = jest.fn().mockReturnValue('newToken');

    const result = await authService.refreshToken('validToken');
    expect(result).toHaveProperty('access_token');
  });

  it('should throw an error for invalid or expired token', async () => {
    tokenService.verifyToken = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await expect(authService.refreshToken('invalidToken')).rejects.toThrow(
      ErrorMessages.InvalidOrExpiredKey
    );
  });
});
