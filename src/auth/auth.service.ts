import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ username }, '+password');

    // if we can't find user we don't need to pass to pass compare
    if (!user || !user.password) {
      return null;
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    if (!user) {
      throw new BadRequestException('user not found');
    }
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
