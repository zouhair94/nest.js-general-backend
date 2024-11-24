import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NoteService } from '../../note/note.service';

@Injectable()
export class NoteAuthorizationGuard implements CanActivate {
  constructor(
    private readonly noteService: NoteService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const noteId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (!user || !noteId) {
      throw new ForbiddenException('User or Note ID missing.');
    }

    // Check if the user is an admin
    if (user.role === 'admin') {
      return true;
    }

    // Check if the note belongs to the user
    const note = await this.noteService.findOne(noteId);
    if (!note) {
      throw new ForbiddenException('Note not found.');
    }

    if (note.owner.toString() === user.userId) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied you must be admin or owner of the note.',
    );
  }
}
