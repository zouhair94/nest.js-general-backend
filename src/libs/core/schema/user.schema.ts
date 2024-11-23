import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class UserDocument extends AbstractDocument {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  surname: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  // select false in order to protect the password in case of any injection or data leak
  @ApiProperty()
  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.String, default: 'user' })
  role: string;
}

export const userSchema = SchemaFactory.createForClass(UserDocument);
