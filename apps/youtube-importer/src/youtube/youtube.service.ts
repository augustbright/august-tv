import { env } from '@august-tv/env';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { times } from 'lodash';
import { VideoDownloaderService } from './video-downloader.service';
import * as path from 'path';
import { YoutubeImportRequestDto } from '@august-tv/server/dto';
import {
  JobsService,
  PrismaService,
  KafkaEmitterService,
} from '@august-tv/server/modules';
import { KafkaTopics } from '@august-tv/server/kafka';

const YOUTUBE_CC_CHANNEL_ID = 'UCTwECeGqMZee77BjdoYtI2Q';

@Injectable()
export class YoutubeService {
  private readonly API_URL = env.YOUTUBE_API_URL;
  private readonly API_KEY = env.YOUTUBE_API_KEY;

  private readonly logger: Logger = new Logger(YoutubeService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly videoDownloaderService: VideoDownloaderService,
    private readonly jobsService: JobsService,
    private readonly prismaService: PrismaService,
    private readonly kafkaEmitterService: KafkaEmitterService,
  ) {
    this.logger.log('YouTube service initialized');
  }

  async importFromYoutube(params: YoutubeImportRequestDto) {
    const numberOfVideos = params.numberOfVideos ?? 1;

    console.log('Importing from YouTube');
    this.logger.log(`Importing ${numberOfVideos} videos from YouTube`);
    await this.jobsService.wrap(
      {
        name: `Importing ${numberOfVideos} videos from YouTube`,
        type: 'import-from-youtube',
        payload: {},
        observers: params.observers,
      },
      async (job) => {
        if (params.videoId) {
          await this.importOneVideoFromYoutube({
            ...params,
            videoId: params.videoId,
          });
        } else {
          const jobsRemaining = params.numberOfVideos ?? 1;

          job.stage(
            `${params.numberOfVideos - jobsRemaining}/${params.numberOfVideos} videos imported`,
          );

          await times(params.numberOfVideos ?? 1, async () => {
            await this.importOneVideoFromYoutube(params);
          });
        }
      },
    );
  }

  private async importOneVideoFromYoutube(
    params: YoutubeImportRequestDto & { videoId?: string },
  ) {
    let video: any = null;
    if (!params.videoId) {
      const channelId = params.channelId ?? YOUTUBE_CC_CHANNEL_ID;
      video = await this.getRandomSmallVideoFromChannel(channelId);
    } else {
      video = (await this.getVideoDetails([params.videoId])).at(0);
    }
    if (!video) throw new NotFoundException('Video not found');

    const { filePath } = await this.videoDownloaderService.downloadVideo(
      video.id,
      {
        observers: params.observers,
      },
    );
    this.kafkaEmitterService.emit(KafkaTopics.YoutubeVideoForImportDownloaded, {
      authorId: params.authorId,
      observers: params.observers,
      originalName: path.basename(filePath as string),
      originalId: video.id,
      path: filePath as string,
      videoTitle: video.snippet.title,
      videoDescription: video.snippet.description,
      publicImmediately: !!params.publicImmediately,
    });
  }

  private async getRandomVideoFromChannel(
    channelId: string,
  ): Promise<string[]> {
    try {
      const url = `${this.API_URL}/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=300`;

      const response = await firstValueFrom(this.httpService.get(url));
      const videos = response.data.items.filter((item) => item.id.videoId); // Only include videos

      if (videos.length === 0) {
        throw new HttpException('No videos found', HttpStatus.NOT_FOUND);
      }

      // Return an array of video IDs
      return videos.map((video) => video.id.videoId);
    } catch (error) {
      this.logger.error('Failed to fetch videos', error);
      throw new HttpException('Failed to fetch videos', HttpStatus.BAD_REQUEST);
    }
  }

  private async getRandomSmallVideoFromChannel(channelId: string) {
    try {
      // Step 1: Get video IDs from the channel
      const videoIds = await this.getRandomVideoFromChannel(channelId);

      // Step 2: Get video details for those IDs
      const videoDetails = await this.getVideoDetails(videoIds);

      // Step 3: Filter videos based on duration (e.g., less than 10 minutes)
      let filteredVideos = videoDetails.filter((video) => {
        const duration = this.parseISO8601Duration(
          video.contentDetails.duration,
        );
        return duration < 10 * 60; // Videos less than 10 minutes
      });

      const alreadyImported = await this.prismaService.imported.findMany({
        where: {
          AND: [
            {
              originalId: {
                in: filteredVideos.map((video) => video.id),
              },
            },
            {
              source: 'youtube',
            },
            {
              deleted: false,
            },
          ],
        },
        select: {
          id: true,
        },
      });

      filteredVideos = filteredVideos.filter(
        (video) =>
          !alreadyImported.some((imported) => imported.id === video.id),
      );

      const randomVideo =
        filteredVideos[Math.floor(Math.random() * filteredVideos.length)];

      return randomVideo;
    } catch (error) {
      this.logger.error('Failed to fetch videos', error);
      throw new HttpException('Failed to fetch videos', HttpStatus.BAD_REQUEST);
    }
  }

  private async getVideoDetails(videoIds: string[]): Promise<any[]> {
    try {
      const url = `${this.API_URL}/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${this.API_KEY}`;

      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.items; // Returns video details including contentDetails and snippet
    } catch (error) {
      this.logger.error('Failed to fetch video details', error);
      throw new HttpException(
        'Failed to fetch video details',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private parseISO8601Duration(duration: string): number {
    const regex =
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
    const matches = duration.match(regex);

    if (!matches) {
      throw new Error('Invalid ISO 8601 duration');
    }

    const hours = parseInt(matches[4] || '0', 10);
    const minutes = parseInt(matches[5] || '0', 10);
    const seconds = parseInt(matches[6] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds; // Total duration in seconds
  }
}
