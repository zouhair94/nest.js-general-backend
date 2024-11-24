import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../libs/core';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;

  @ApiProperty({
    name: 'role',
    enum: UserRole,
  })
  role: string;
}
