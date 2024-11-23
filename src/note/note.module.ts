import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { DatabaseModule, NoteDocument, noteSchema } from '../libs/core';
import { NoteRepository } from './note.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: NoteDocument.name, schema: noteSchema },
    ]),
  ],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
})
export class NoteModule {}
