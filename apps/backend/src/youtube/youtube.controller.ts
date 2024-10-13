import { Body, Controller, Post } from '@nestjs/common';
import { Guard } from 'src/common/guard';
import { YoutubeService } from './youtube.service';
import { VideoDownloaderService } from './video-downloader.service';
import { User } from 'src/user/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { MediaService } from 'src/media/media.service';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

const channelId = 'UCTwECeGqMZee77BjdoYtI2Q';

@Controller('youtube')
export class YoutubeController {
  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly videoDownloaderService: VideoDownloaderService,
    private readonly mediaService: MediaService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('/upload-random')
  @Guard.scope('admin')
  async uploadRandomVideo(
    @Body() body: { authorId: string },
    @User({ required: true }) user: DecodedIdToken,
  ) {
    // Get a random video ID from the channel
    const videoId =
      await this.youtubeService.getRandomSmallVideoFromChannel(channelId);

    // Download the video and return the file path
    const downloadJob = await this.videoDownloaderService.downloadVideo(
      videoId,
      {
        observers: [user.uid],
      },
    );

    downloadJob.once('done', async () => {
      const { filePath, originalname } = downloadJob.metadata;
      const { job: processingJob, video } = await this.mediaService.upload(
        {
          path: filePath as string,
          originalname: path.basename(filePath as string),
        },
        body.authorId,
        {
          observers: [user.uid],
        },
      );

      processingJob.once('done', async () => {
        await this.prismaService.video.update({
          where: { id: video.id },
          data: {
            visibility: 'PUBLIC',
            title: originalname as string,
          },
        });
      });
    });

    return downloadJob.forClient();
  }
}
