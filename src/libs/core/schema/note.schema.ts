import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import * as mongoose from 'mongoose';
import { UserDocument } from './user.schema';

@Schema({ timestamps: true })
export class NoteDocument extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ ref: UserDocument.name, type: mongoose.Schema.Types.ObjectId })
  owner: string;
}

export const noteSchema = SchemaFactory.createForClass(NoteDocument);
