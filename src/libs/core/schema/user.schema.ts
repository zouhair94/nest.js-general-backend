import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  // select false in order to protect the password in case of any injection or data leak
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: mongoose.Schema.Types.String, default: 'user' })
  role: string;
}

export const userSchema = SchemaFactory.createForClass(UserDocument);
