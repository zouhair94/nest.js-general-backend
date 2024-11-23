import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should goes throw jwt verifyUser', () => {
    it('should return null if user does not exist', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser('nonexistentuser', 'password');

      expect(userService.findOne).toHaveBeenCalledWith(
        { username: 'nonexistentuser' },
        '+password',
      );
      expect(result).toBeNull();
    });
  });
  describe('should goes throw jwt sign', () => {
    it('should return an access token', async () => {
      // Arrange: Mock user and JWT sign method
      const mockUser = { username: 'testuser', _id: '12345' };
      const mockToken = 'mockJwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      // Act: Call the login method
      const result = await service.login(mockUser);

      // Assert: Verify the result and interactions
      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: '12345',
      });
    });
  });
});
