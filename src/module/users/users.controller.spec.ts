import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersMock } from '../../../mocked/users';
import { CryptoModule, TokenModule } from '../../utils';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [CryptoModule, TokenModule],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const expectedResponse = { token: 'jwt.io token' };
    jest.spyOn(userService, 'create').mockResolvedValue(expectedResponse);

    expect(await controller.create(usersMock.default.user)).toBe(
      expectedResponse
    );
  });

  it('should return an array of users', async () => {
    jest
      .spyOn(userService, 'findAll')
      .mockResolvedValue(usersMock.default.users);

    expect(await controller.findAll()).toBe(usersMock.default.users);
  });

  it('should call findAll from userService when guarded route is accessed', async () => {
    jest
      .spyOn(userService, 'findAll')
      .mockResolvedValue(usersMock.default.users);

    const result = await controller.findAllGuard();

    expect(result).toEqual(usersMock.default.users);
    expect(userService.findAll).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const token = { token: 'jwt.io token' };
    jest.spyOn(userService, 'update').mockResolvedValue(token);

    expect(
      await controller.update(
        usersMock.default.user2.id,
        usersMock.default.user2
      )
    ).toBe(token);
  });

  it('should remove a user successfully', async () => {
    const userId = 1;
    const deleteResponse = { success: 'Usuario deletado com sucesso' };

    jest.spyOn(userService, 'remove').mockResolvedValue(deleteResponse);

    const result = await controller.remove(userId);

    expect(result).toEqual(deleteResponse);
  });

  it('should return a user for a valid id', async () => {
    const userId = 1;

    jest.spyOn(userService, 'findBy').mockResolvedValue(usersMock.default.user);

    const result = await controller.findOne(userId);

    expect(result).toEqual(usersMock.default.user);
    expect(userService.findBy).toHaveBeenCalledWith(userId);
  });
});
