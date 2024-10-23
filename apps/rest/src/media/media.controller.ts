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
import { UPLOAD_PATH } from '@august-tv/server/fs-utils';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Guard } from '@august-tv/server/utils';
import { User } from 'src/user/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ImageCropDto, PatchMediaDto } from '@august-tv/server/dto';
import { KafkaEmitterService } from '@august-tv/server/modules';
import { KafkaTopics } from '@august-tv/server/kafka';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly kafkaEmitterService: KafkaEmitterService,
  ) { }

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
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @User({ required: true }) user: DecodedIdToken,
  ) {
    const draft = await this.mediaService.createDraft({
      title: file.originalname,
      author: {
        connect: {
          id: user.uid,
        },
      },
      fileSet: {
        create: {},
      },
      thumbnailSet: {
        create: {},
      },
    });

    this.kafkaEmitterService.emit(KafkaTopics.VideoFileUploaded, {
      observers: [user.uid],
      path: file.path,
      draft,
    });

    return draft;
  }

  @Get(':id/thumbnails')
  @Guard.scope('user')
  async getThumbnails(
    @Param('id') id: string,
    @User({ required: true }) user?: DecodedIdToken,
  ) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'WRITE');
    return this.mediaService.getThumbnails(id);
  }

  @Patch(':id')
  @Guard.scope('user')
  async patchMedia(
    @Param('id') id: string,
    @Body() updateVideoDto: PatchMediaDto,
    @User() user?: DecodedIdToken,
  ) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'WRITE');
    return this.mediaService.patch(id, updateVideoDto);
  }

  @Post(':id/uploadThumbnail')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!file.mimetype.includes('image')) {
          return callback(new Error('Only image files are allowed!'), false);
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
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: ImageCropDto,
    @User({ required: true }) user: DecodedIdToken,
  ) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'WRITE');
    const image = await this.mediaService.uploadThumbnail({
      videoId: id,
      crop: body,
      userId: user.uid,
      file: {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
      },
    });

    return image;
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
  async getMediaById(@Param('id') id: string, @User() user: DecodedIdToken) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'READ');
    return this.mediaService.getMediaById(id, user?.uid);
  }

  @Delete(':id')
  @Guard.scope('user')
  async deleteMedia(@Param('id') id: string, @User() user?: DecodedIdToken) {
    await this.mediaService.assertPermissionsForUser(id, user?.uid, 'DELETE');
    return this.mediaService.delete(id);
  }

  @Post('/rate/:id')
  @Guard.scope('user')
  async rateMedia(
    @Param('id') id: string,
    @Body() rateDto: { type: 'LIKE' | 'DISLIKE' | null; },
    @User({ required: true }) user: DecodedIdToken,
  ) {
    return this.mediaService.rate(id, user.uid, rateDto.type);
  }
}
