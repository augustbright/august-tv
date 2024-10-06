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
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMedia(@UploadedFile() file: any, @Req() req: any) {
    return this.mediaService.upload(file, req.user);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Media updated.',
  })
  patchMedia(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.mediaService.patch(id, updateVideoDto);
  }
}
