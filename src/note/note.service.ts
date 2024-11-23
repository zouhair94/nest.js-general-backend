import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';

@Injectable()
export class NoteService {
  constructor(private readonly noteRepository: NoteRepository) {}

  async create(createNoteDto: CreateNoteDto) {
    return await this.noteRepository.create(createNoteDto);
  }

  async findAll() {
    return await this.noteRepository.find({});
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('ID must be defined!');
    }
    return await this.noteRepository.findOne({ _id: id });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    if (!id || !updateNoteDto) {
      throw new BadRequestException('ID and data must be defined!');
    }
    return await this.noteRepository.findOneAndUpdate(
      { _id: id },
      updateNoteDto,
    );
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('ID must be defined!');
    }
    return await this.noteRepository.findOneAndDelete({ _id: id });
  }
}
