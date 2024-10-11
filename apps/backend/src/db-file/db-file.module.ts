import { Module } from '@nestjs/common';
import { DbFileService } from './db-file.service';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [StorageModule, PrismaModule],
  providers: [DbFileService],
  exports: [DbFileService],
})
export class DbFileModule {}