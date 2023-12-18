import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CryptoService } from '../../utils/crypto/crypto.service';
import { TokenService } from '../../utils/token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import prisma from '../../../client';
import { User } from './entities/user.entity';
import { ErrorMessages } from '../../core/errorhandler/constants/errorMessages';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.cryptoService.encrypt(
        createUserDto.password
      );

      const user = await prisma.users.create({
        data: { ...createUserDto, password: hashedPassword },
      });

      const token = this.tokenService.tokenizer({
        userId: user.id,
        name: user.name,
      });

      return { token };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async findAll() {
    try {
      const users = await prisma.users.findMany();
      return users;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async findBy(identifier: string | number) {
    let query: Prisma.UsersWhereUniqueInput;

    if (typeof identifier === 'string' && identifier.trim() !== '') {
      query = { email: identifier };
    } else if (typeof identifier === 'number' && !isNaN(identifier)) {
      query = { id: identifier };
    } else {
      throw new HttpException(
        'Invalid identifier provided',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const user = await prisma.users.findUnique({
        where: query,
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if ('id' in updateUserDto) {
        delete updateUserDto.id;
      }

      const user = await prisma.users.update({
        data: updateUserDto,
        where: { id },
      });

      const token = this.tokenService.tokenizer({
        userId: user.id,
        name: user.name,
      });

      return { token };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async remove(id: number) {
    try {
      await prisma.users.delete({
        where: { id },
      });

      return { success: 'Usuario deletado com sucesso' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async login(user: any): Promise<User | Boolean> {
    const userFromDb = await this.findBy(user.email);

    if (!userFromDb) {
      return false;
    }

    const isPasswordMatching = await this.cryptoService.validate(
      user.password,
      userFromDb.password
    );

    if (!isPasswordMatching) {
      throw new Error(ErrorMessages.InvalidCredentials);
    }

    return userFromDb;
  }
}
