import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [PrismaModule, ImageModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
