import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as mongoose from 'mongoose';

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const id = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: id,
        name: 'Jane',
        surname: 'Doe',
        username: 'janeUser',
        password: 'test123',
        email: 'Doe@test',
        role: 'user',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const { _id } = id;
      const result = await controller.findOne(_id.toString());
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith({ _id: _id.toString() });
    });
  });
  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'Jane',
        surname: 'Doe',
        username: 'janeUser',
        password: 'test123',
        email: 'Doe@test',
        role: 'user',
      };
      const mockCreatedUser = {
        _id: new mongoose.Types.ObjectId(),
        ...createUserDto,
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockCreatedUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
