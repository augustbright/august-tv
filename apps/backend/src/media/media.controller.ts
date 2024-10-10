import 'reflect-metadata';
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVideoDto } from './dto/update-video.dto';
import { diskStorage } from 'multer';
import { UPLOAD_PATH } from 'src/common/fs-utils';
import { randomUUID } from 'crypto';
import * as path from 'path';

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
  uploadMedia(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.mediaService.upload(file, req.user);
  }

  @Patch(':id')
  patchMedia(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.mediaService.patch(id, updateVideoDto);
  }

  @Get('/my')
  async getMyMedia(@Req() req: any) {
    return {
      data: await this.mediaService.getUserMedia(req.user),
    };
  }

  @Get(':id')
  async getMediaById(@Param('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
