import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    createNoteDto.owner = req.user.userId;
    return await this.noteService.create(createNoteDto);
  }

  @Get()
  async findAll() {
    return await this.noteService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.noteService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return await this.noteService.update(id, updateNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.noteService.remove(id);
  }
}
