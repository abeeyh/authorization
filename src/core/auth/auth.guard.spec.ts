import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { TokenService } from '../../utils/services';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: TokenService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    tokenService = module.get<TokenService>(TokenService);
  });

  const mockExecutionContext = (authHeader?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: authHeader,
        },
      }),
    }),
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const context = mockExecutionContext();
    await expect(authGuard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException
    );
    expect(tokenService.verifyToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if authorization header does not contain a token', async () => {
    const context = mockExecutionContext('Bearer ');
    await expect(authGuard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException
    );
    expect(tokenService.verifyToken).not.toHaveBeenCalled();
  });

  it('should return a valid payload for a valid token', async () => {
    const validPayload = { userId: '1234' };
    tokenService.verifyToken = jest.fn().mockResolvedValue(validPayload);
    const context = mockExecutionContext('Bearer validToken');
    await expect(authGuard.canActivate(context as any)).resolves.toEqual(
      validPayload
    );
  });

  it('should throw UnauthorizedException for an invalid token', async () => {
    tokenService.verifyToken = jest.fn().mockImplementation(() => {
      throw new UnauthorizedException(ErrorMessages.InvalidCredentials);
    });
    const context = mockExecutionContext('Bearer invalidToken');
    await expect(authGuard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should rethrow an unexpected error', async () => {
    const unexpectedError = new Error('Unexpected error');
    tokenService.verifyToken = jest.fn().mockImplementation(() => {
      throw unexpectedError;
    });
    const context = mockExecutionContext('Bearer token');
    await expect(authGuard.canActivate(context as any)).rejects.toThrow(
      unexpectedError
    );
  });
});
