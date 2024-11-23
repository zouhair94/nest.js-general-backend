import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const verify = await this.userRepository.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (verify) {
      throw new UnauthorizedException('This user already exists!');
    }
    return await this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 12),
    });
  }

  async findAll(filters = {}) {
    return await this.userRepository.find(filters);
  }

  async findOne(filters = {}, select: string = null) {
    return await this.userRepository.findOne(filters, select);
  }
}
