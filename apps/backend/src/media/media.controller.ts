import 'reflect-metadata';
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UPLOAD_PATH } from 'src/common/fs-utils';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Guard } from 'src/common/guard';
import { User } from 'src/user/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!file.mimetype.includes('video')) {
          return callback(new Error('Only video files are allowed!'), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: UPLOAD_PATH,
        filename: (req, file, cb) => {
          cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Guard.scope('user')
  uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @User() user?: DecodedIdToken,
  ) {
    return this.mediaService.upload(file, user);
  }

  @Patch(':id')
  @Guard.scope('user')
  async patchMedia(
    @Param('id') id: string,
    @Body() updateVideoDto,
    @User() user?: DecodedIdToken,
  ) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'WRITE');
    return this.mediaService.patch(id, updateVideoDto);
  }

  @Get('/my')
  @Guard.scope('user')
  async getMyMedia(@User() user?: DecodedIdToken) {
    return {
      data: await this.mediaService.getUserMedia(user),
    };
  }

  @Get(':id')
  @Guard.scope('public')
  async getMediaById(@Param('id') id: string, @User() user?: DecodedIdToken) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'READ');
    return this.mediaService.getMediaById(id);
  }

  @Delete(':id')
  @Guard.scope('user')
  async deleteMedia(@Param('id') id: string, @User() user?: DecodedIdToken) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'DELETE');
    return this.mediaService.delete(id);
  }
}
