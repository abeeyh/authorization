import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CryptoService, TokenService } from '../../utils/services';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { prismaMock } from '../../../singleton';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { usersMock } from '../../../mocked/users';
import { ErrorMessages } from '../../core/errorhandler/constants/errorMessages';

describe('UsersService', () => {
  let service: UsersService;
  let cryptoService: CryptoService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CryptoService,
          useValue: {
            encrypt: jest.fn().mockResolvedValue('hashedPassword'),
            validate: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: { tokenizer: jest.fn().mockReturnValue('token') },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    cryptoService = module.get<CryptoService>(CryptoService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should create a user and return a token', async () => {
    const createUserDto = new CreateUserDto();

    prismaMock.users.create.mockResolvedValue(usersMock.default.user);

    const result = await service.create(usersMock.default.incompletedUser);

    expect(cryptoService.encrypt).toHaveBeenCalledWith(
      usersMock.default.user.password
    );
    expect(prismaMock.users.create).toHaveBeenCalled();
    expect(tokenService.tokenizer).toHaveBeenCalled();
    expect(result).toHaveProperty('token', 'token');
  });

  it('should throw a bad request exception for Prisma client known request errors', async () => {
    prismaMock.users.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error message', {
        code: 'P1001',
        clientVersion: 'x.y.z',
      })
    );

    const createUserDto = new CreateUserDto();
    createUserDto.password = 'password123';

    await expect(service.create(createUserDto)).rejects.toThrow(HttpException);
  });

  it('should throw an internal server error for general errors', async () => {
    prismaMock.users.create.mockRejectedValue(new Error('Generic Error'));

    await expect(
      service.create(usersMock.default.incompletedUser)
    ).rejects.toThrow(
      new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR)
    );
  });

  it('should return an array of users', async () => {
    prismaMock.users.findMany.mockResolvedValue(usersMock.default.users);

    const users = await service.findAll();
    expect(users).toEqual(usersMock.default.users);
  });

  it('should throw a bad request exception for Prisma client known request errors', async () => {
    prismaMock.users.findMany.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error message', {
        code: 'P1001',
        clientVersion: 'x.y.z',
      })
    );

    await expect(service.findAll()).rejects.toThrow(HttpException);
    await expect(service.findAll()).rejects.toThrow(
      new HttpException('Error message', HttpStatus.BAD_REQUEST)
    );
  });

  it('should throw an internal server error for general errors', async () => {
    prismaMock.users.findMany.mockRejectedValue(new Error('Generic Error'));

    await expect(service.findAll()).rejects.toThrow(HttpException);
    await expect(service.findAll()).rejects.toThrow(
      new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR)
    );
  });
  it('should find a user by numeric id', async () => {
    const userId = 1;
    prismaMock.users.findUnique.mockResolvedValue(usersMock.default.user);
    const result = await service.findBy(userId);
    expect(result).toEqual(usersMock.default.user);
    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it('should find a user by email', async () => {
    const userEmail = 'test@example.com';
    prismaMock.users.findUnique.mockResolvedValue(usersMock.default.user2);
    const result = await service.findBy(userEmail);
    expect(result).toEqual(usersMock.default.user2);
    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: { email: userEmail },
    });
  });

  it('should throw BadRequestException for invalid string identifier', async () => {
    await expect(service.findBy('')).rejects.toThrow(
      new HttpException('Invalid identifier provided', HttpStatus.BAD_REQUEST)
    );
  });

  it('should throw BadRequestException for invalid numeric identifier', async () => {
    await expect(service.findBy(NaN)).rejects.toThrow(
      new HttpException('Invalid identifier provided', HttpStatus.BAD_REQUEST)
    );
  });

  it('should throw BadRequestException for PrismaClientKnownRequestError', async () => {
    prismaMock.users.findUnique.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error message', {
        code: 'P1001',
        clientVersion: 'x.y.z',
      })
    );
    await expect(service.findBy(1)).rejects.toThrow(
      new HttpException('Error message', HttpStatus.BAD_REQUEST)
    );
  });

  it('should throw InternalServerErrorException for general errors', async () => {
    prismaMock.users.findUnique.mockRejectedValue(new Error('Generic Error'));
    await expect(service.findBy(1)).rejects.toThrow(
      new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR)
    );
  });

  it('should successfully log in a user with correct credentials', async () => {
    prismaMock.users.findUnique.mockResolvedValue(usersMock.default.user2);
    (cryptoService.validate as jest.Mock).mockResolvedValue(Promise<true>);

    const result = await service.login({
      email: usersMock.default.user2.email,
      password: 'password123',
    });

    expect(result).toEqual(usersMock.default.user2);
    expect(cryptoService.validate).toHaveBeenCalledWith(
      'password123',
      usersMock.default.user2.password
    );
  });

  it('should return false for a non-existent user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    const result = await service.login({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(result).toBe(false);
  });

  it('should throw an error for incorrect password', async () => {
    const mockUser = { email: 'user@example.com', password: 'hashedPassword' };
    prismaMock.users.findUnique.mockResolvedValue(usersMock.default.user2);
    (cryptoService.validate as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: mockUser.email, password: 'wrongPassword' })
    ).rejects.toThrow(new Error(ErrorMessages.InvalidCredentials));
  });

  it('should update a user and return the updated data', async () => {
    prismaMock.users.update.mockResolvedValue(usersMock.default.user2);

    const result = await service.update(1, usersMock.default.user2);

    expect(prismaMock.users.update).toHaveBeenCalledWith({
      data: usersMock.default.user2,
      where: { id: 1 },
    });
    expect(result).toEqual({ token: 'token' });
  });

  it('should throw a bad request exception for Prisma client known request errors', async () => {
    prismaMock.users.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error message', {
        code: 'P1001',
        clientVersion: 'x.y.z',
      })
    );

    await expect(service.update(1, new UpdateUserDto())).rejects.toThrow(
      HttpException
    );
  });

  it('should throw an internal server error for general errors', async () => {
    prismaMock.users.update.mockRejectedValue(new Error('Generic Error'));

    await expect(service.update(1, new UpdateUserDto())).rejects.toThrow(
      new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR)
    );
  });

  it('should delete a user', async () => {
    const userId = 1;

    prismaMock.users.delete.mockResolvedValue(usersMock.default.user);

    const result = await service.remove(userId);

    expect(prismaMock.users.delete).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(result).toEqual({ success: 'Usuario deletado com sucesso' });
  });

  it('should throw a Prisma client known request error for Prisma client known request errors', async () => {
    prismaMock.users.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error message', {
        code: 'P1001',
        clientVersion: 'x.y.z',
      })
    );

    await expect(service.remove(1)).rejects.toThrow(
      new HttpException('Error message', HttpStatus.BAD_REQUEST)
    );
  });

  it('should throw an internal server error for general errors', async () => {
    const userId = 1;
    prismaMock.users.delete.mockRejectedValue(new Error('An error occurred'));

    await expect(service.remove(userId)).rejects.toThrow(
      new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR)
    );
  });
});
