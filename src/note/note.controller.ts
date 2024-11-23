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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateNoteDto,
  })
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    createNoteDto.owner = req.user.userId;
    return await this.noteService.create(createNoteDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all notes.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: { $ref: getSchemaPath(CreateNoteDto) },
        },
      },
    },
  })
  async findAll() {
    return await this.noteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'returns the select note.',
    type: CreateNoteDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.noteService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'returns the updated note.',
    type: CreateNoteDto,
  })
  @ApiBody({ description: 'Data schema for update.', type: CreateNoteDto })
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return await this.noteService.update(id, updateNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'returns the removed note.',
    type: CreateNoteDto,
  })
  async remove(@Param('id') id: string) {
    return await this.noteService.remove(id);
  }
}
