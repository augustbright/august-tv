import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@august-tv/server/modules';
import { ImageModule } from '@august-tv/server/modules';
import { JobsModule } from '@august-tv/server/modules';

@Module({
  imports: [PrismaModule, ImageModule, JobsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
