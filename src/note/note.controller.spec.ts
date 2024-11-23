import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

import * as mongoose from 'mongoose';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
const { _id } = new mongoose.Types.ObjectId();
const mockResult = {
  _id,
  title: 'Note 1',
  content: 'dummy text',
  owner: 'str',
};
describe('NotesController', () => {
  let controller: NoteController;
  let service: NoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call NotesService.create with correct parameters', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'This is a test note',
        owner: 'user123',
      };
      const mockResults = {
        _id,
        ...createNoteDto,
      };
      const mockUser = { userId: 'user123' };
      const mockRequest = { user: mockUser };
      //const mockResult = { id: '1', owner: mockUser._id, ...createNoteDto };

      jest.spyOn(service, 'create').mockResolvedValue(mockResults);

      const result = await controller.create(createNoteDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith({
        ...createNoteDto,
        owner: mockUser.userId,
      });
      expect(result).toEqual(mockResults);
    });
  });

  describe('findAll', () => {
    it('should call NotesService.findAll and return all notes', async () => {
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

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResults);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResults);
    });
  });

  describe('findOne', () => {
    it('should call NotesService.findOne with the correct id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult);

      const result = await controller.findOne(_id.toString());

      expect(service.findOne).toHaveBeenCalledWith(_id.toString());
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call NotesService.update with correct parameters', async () => {
      const updateNoteDto: UpdateNoteDto = { title: 'Updated Note' };
      jest.spyOn(service, 'update').mockResolvedValue(mockResult);

      const result = await controller.update(_id.toString(), updateNoteDto);

      expect(service.update).toHaveBeenCalledWith(
        _id.toString(),
        updateNoteDto,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should call NotesService.remove with the correct id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockResult);

      const result = await controller.remove(_id.toString());

      expect(service.remove).toHaveBeenCalledWith(_id.toString());
      expect(result).toEqual(mockResult);
    });
  });
});
