import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from '../../utils/services';
import { usersMock } from '../../../mocked/users';
import { UnauthorizedException } from '@nestjs/common';
import { ErrorMessages } from '../errorhandler/constants/errorMessages';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        TokenService,
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
            authenticateToken: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.generateToken with email and password', async () => {
    const mockBody = { email: 'user@example.com', password: 'password123' };
    await controller.generateToken(mockBody);
    expect(authService.generateToken).toHaveBeenCalledWith(mockBody);
  });

  it('should call AuthService.refreshToken', async () => {
    const token = 'jwt.token';
    const mockRequest = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    await controller.refreshToken(mockRequest as any);
    expect(authService.refreshToken).toHaveBeenCalledWith(token);
  });
});
