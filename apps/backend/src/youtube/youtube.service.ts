import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TImportFromYoutubeParams } from '@august-tv/common/types';
import { JobsService } from 'src/jobs/jobs.service';
import { times } from 'lodash';
import { Job } from 'src/jobs/Job';
import { VideoDownloaderService } from './video-downloader.service';
import { MediaService } from 'src/media/media.service';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

const YOUTUBE_CC_CHANNEL_ID = 'UCTwECeGqMZee77BjdoYtI2Q';

@Injectable()
export class YoutubeService {
  private readonly API_URL = process.env.YOUTUBE_API_URL!;
  private readonly API_KEY = process.env.YOUTUBE_API_KEY!;

  private logger: Logger = new Logger(YoutubeService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly jobsService: JobsService,
    private readonly videoDownloaderService: VideoDownloaderService,
    private readonly mediaService: MediaService,
    private readonly prismaService: PrismaService,
  ) {}

  async importFromYoutube(params: TImportFromYoutubeParams) {
    const numberOfVideos = params.numberOfVideos ?? 1;

    const job = await this.jobsService.create(
      {
        name: `Importing ${numberOfVideos} videos from YouTube`,
        type: 'import-from-youtube',
        payload: {},
      },
      {
        observers: params.observers,
      },
    );

    this.performJobImportFromYoutube(params, job);

    return job;
  }

  private async performJobImportFromYoutube(
    params: TImportFromYoutubeParams,
    job: Job,
  ) {
    if (params.videoId) {
      const importOneJob = await this.jobsService.create(
        {
          type: 'import-one-from-youtube',
          name: `Importing video`,
          payload: {},
        },
        {
          observers: params.observers,
        },
      );
      await job.registerChildJob(importOneJob);
      this.performJobImportOneVideoFromYoutube(
        {
          ...params,
          videoId: params.videoId,
        },
        importOneJob,
      );
    } else {
      times(params.numberOfVideos ?? 1, async (idx) => {
        const importOneJob = await this.jobsService.create(
          {
            type: 'import-one-from-youtube',
            name: `Importing video ${idx + 1}`,
            payload: {},
          },
          {
            observers: params.observers,
          },
        );

        await job.registerChildJob(importOneJob);
        this.performJobImportOneVideoFromYoutube(params, importOneJob);
      });
    }
  }

  private async performJobImportOneVideoFromYoutube(
    params: TImportFromYoutubeParams & { videoId?: string },
    job: Job,
  ) {
    let videoId = params.videoId;
    if (!videoId) {
      job.stage('Looking for a video to import');
      const channelId = params.channelId ?? YOUTUBE_CC_CHANNEL_ID;
      videoId = await this.getRandomSmallVideoFromChannel(channelId);
      if (!videoId) {
        job.error('No video found');
        return;
      }
    }

    job.stage('Downloading video');
    const downloadJob = await this.videoDownloaderService.downloadVideo(
      videoId,
      {
        observers: params.observers,
      },
    );
    job.registerChildJob(downloadJob);

    downloadJob.once('done', async () => {
      job.stage('Processing video');
      const { filePath, originalname } = downloadJob.metadata;
      const { job: processingJob, video } = await this.mediaService.upload(
        {
          path: filePath as string,
          originalname: path.basename(filePath as string),
        },
        params.authorId,
        {
          observers: params.observers,
        },
      );

      job.registerChildJob(processingJob);

      processingJob.once('done', async () => {
        await this.prismaService.video.update({
          where: { id: video.id },
          data: {
            ...(params.publicImmediately ? { visibility: 'PUBLIC' } : {}),
            title: originalname as string,
          },
        });
        job.done();
      });
    });
  }

  private async getRandomVideoFromChannel(
    channelId: string,
  ): Promise<string[]> {
    try {
      const url = `${this.API_URL}/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50`;

      const response = await firstValueFrom(this.httpService.get(url));
      const videos = response.data.items.filter((item) => item.id.videoId); // Only include videos

      if (videos.length === 0) {
        throw new HttpException('No videos found', HttpStatus.NOT_FOUND);
      }

      // Return an array of video IDs
      return videos.map((video) => video.id.videoId);
    } catch {
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
      const filteredVideos = videoDetails.filter((video) => {
        const duration = this.parseISO8601Duration(
          video.contentDetails.duration,
        );
        return duration < 10 * 60; // Videos less than 10 minutes
      });

      const randomVideo =
        filteredVideos[Math.floor(Math.random() * filteredVideos.length)];
      const videoId = randomVideo.id;

      return videoId;
    } catch {
      throw new HttpException('Failed to fetch videos', HttpStatus.BAD_REQUEST);
    }
  }

  private async getVideoDetails(videoIds: string[]): Promise<any[]> {
    try {
      const url = `${this.API_URL}/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${this.API_KEY}`;

      const response = await firstValueFrom(this.httpService.get(url));

      return response.data.items; // Returns video details including contentDetails and snippet
    } catch {
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
