import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import * as mongoose from 'mongoose';
import { NoteRepository } from './note.repository';
import { CreateNoteDto } from './dto/create-note.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateNoteDto } from './dto/update-note.dto';

const mockRepository = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
};

const { _id } = new mongoose.Types.ObjectId();
const mockResult = {
  _id,
  title: 'Note 1',
  content: 'dummy text',
  owner: 'str',
};

describe('NotesService', () => {
  let service: NoteService;
  let notesRepository: NoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: NoteRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    notesRepository = module.get(NoteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(notesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should call NotesRepository.create with correct parameters', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'This is a test note',
        owner: 'str',
      };
      const mockResults = {
        _id,
        ...createNoteDto,
      };
      jest.spyOn(notesRepository, 'create').mockResolvedValue(mockResults);

      const result = await service.create(createNoteDto);
      expect(notesRepository.create).toHaveBeenCalledWith(createNoteDto);
      expect(result).toEqual(mockResults);
    });
  });
  describe('findAll', () => {
    it('should call NotesRepository.find and return all notes', async () => {
      const mockResults = [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Note 1',
          content: 'dummy text',
          owner: 'str',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Note 2',
          content: 'dummy text',
          owner: 'str',
        },
      ];
      jest.spyOn(notesRepository, 'find').mockResolvedValue(mockResults);

      const result = await service.findAll();
      expect(notesRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResults);
    });
  });

  describe('findOne', () => {
    it("should throw error if id doesn't exists", async () => {
      const result = service.findOne(null);
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });
    it('should call NotesRepository.findOne with the correct id', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValue(mockResult);

      const result = await service.findOne(_id.toString());
      expect(notesRepository.findOne).toHaveBeenCalledWith({
        _id: _id.toString(),
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it("should throw error if id doesn't exists", async () => {
      const result = service.update(null, {});
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    it("should throw error if the data doesn't is empty", async () => {
      const result = service.update('1', null);
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should call NotesRepository.findOneAndUpdate with correct parameters', async () => {
      const updateNoteDto: UpdateNoteDto = { title: 'Updated Note' };
      jest
        .spyOn(notesRepository, 'findOneAndUpdate')
        .mockResolvedValue(mockResult);

      const result = await service.update(_id.toString(), updateNoteDto);
      expect(notesRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: _id.toString() },
        updateNoteDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it("should throw error if id doesn't exists", async () => {
      const result = service.remove(null);
      await expect(result).rejects.toBeInstanceOf(BadRequestException);
    });
    it('should call NotesRepository.findOneAndDelete with the correct id', async () => {
      jest
        .spyOn(notesRepository, 'findOneAndDelete')
        .mockResolvedValue(mockResult);

      const result = await service.remove(_id.toString());
      expect(notesRepository.findOneAndDelete).toHaveBeenCalledWith({
        _id: _id.toString(),
      });
      expect(result).toEqual(mockResult);
    });
  });
});
