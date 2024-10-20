import { Module } from '@nestjs/common';
import { UploadingModule } from './uploading/uploading.module';

@Module({
  imports: [UploadingModule],
})
export class AppModule {}
