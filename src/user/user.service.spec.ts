import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { describe } from 'node:test';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';

const usersRepositoryMock = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
});

const usersMock = [
  {
    _id: 1,
    username: 'test1',
    name: 'test',
    surname: 'testSurname',
    email: 'test@test.com',
    password: 'password',
    role: 'admin',
  },
  {
    _id: 2,
    username: 'test2',
    name: 'test',
    surname: 'testSurname2',
    email: 'test2@test.com',
    password: 'password',
    role: 'user',
  },
  {
    _id: 3,
    username: 'test3',
    name: 'test',
    surname: 'testSurname3',
    email: 'test3@test.com',
    password: 'password',
    role: 'user',
  },
];

const user = {
  username: 'test4',
  name: 'test',
  surname: 'testSurname',
  email: 'test4@test.com',
  password: 'password',
  role: 'user',
};

describe('UsersService', () => {
  let userService: UserService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,

        {
          provide: UserRepository,
          useFactory: usersRepositoryMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('should test get users', () => {
    it('get users returns a value', async () => {
      userRepository?.find?.mockResolvedValue(usersMock);
      const result = await userService.findAll();
      expect(result).toEqual(usersMock);
    });

    it('should filter user', async () => {
      // mock User when id = 0
      const mockUser = usersMock[0];
      userRepository?.find?.mockResolvedValue(mockUser);
      const result = await userService.findAll({ _id: 1 });
      expect(result).toEqual(mockUser);
    });
  });
  describe('should test create user', () => {
    it('should create new user', async () => {
      userRepository?.findOne?.mockResolvedValue(null);
      userRepository?.create?.mockResolvedValue(user);
      const result = await userService.create(user);
      expect(result).toEqual(user);
    });

    it('should raise an error if the user exists', async () => {
      userRepository?.findOne?.mockResolvedValue(user);
      await expect(userService.create(user)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
