import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './libs/core';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
