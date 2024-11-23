import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './libs/core';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
