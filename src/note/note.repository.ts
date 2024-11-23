import { AbstractRepository, NoteDocument } from '../libs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NoteRepository extends AbstractRepository<NoteDocument> {
  protected readonly logger = new Logger();
  constructor(@InjectModel(NoteDocument.name) noteModel: Model<NoteDocument>) {
    super(noteModel);
  }
}
