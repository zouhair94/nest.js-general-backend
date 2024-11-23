import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../libs/core';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password!: string;

  @ApiProperty({
    name: 'role',
    enum: UserRole,
  })
  role: string;
}
