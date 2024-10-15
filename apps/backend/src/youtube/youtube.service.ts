import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JobsService } from 'src/jobs/jobs.service';
import { times } from 'lodash';
import { Job } from 'src/jobs/Job';
import { VideoDownloaderService } from './video-downloader.service';
import { MediaService } from 'src/media/media.service';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostImportFromYoutube } from './youtube.dto';

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

  async importFromYoutube(params: PostImportFromYoutube.Body) {
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
  }

  private async performJobImportFromYoutube(
    params: PostImportFromYoutube.Body,
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
      importOneJob.once('done', () => job.done());
      importOneJob.once('error', (error) => job.error(error));
    } else {
      let jobsRemaining = params.numberOfVideos ?? 1;
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
        importOneJob.once('finished', () => {
          jobsRemaining--;
          if (jobsRemaining === 0) {
            job.done();
          }
        });
      });
    }
  }

  private async performJobImportOneVideoFromYoutube(
    params: PostImportFromYoutube.Body & { videoId?: string },
    job: Job,
  ) {
    let video: any = null;
    if (!params.videoId) {
      job.stage('Looking for a video to import');
      const channelId = params.channelId ?? YOUTUBE_CC_CHANNEL_ID;
      video = await this.getRandomSmallVideoFromChannel(channelId);
    } else {
      video = (await this.getVideoDetails([params.videoId])).at(0);
    }
    if (!video) {
      job.error('No video found');
      return;
    }

    job.stage('Downloading video');
    const downloadJob = await this.videoDownloaderService.downloadVideo(
      video.id,
      {
        observers: params.observers,
      },
    );
    job.registerChildJob(downloadJob);

    downloadJob.once('done', async () => {
      job.stage('Processing video');
      const { filePath } = downloadJob.metadata;
      const { job: processingJob, video: dbVideo } =
        await this.mediaService.upload(
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
          where: { id: dbVideo.id },
          data: {
            ...(params.publicImmediately ? { visibility: 'PUBLIC' } : {}),
            title: video.snippet?.title ?? 'Untitled',
            description: video.snippet?.description ?? '',
            imported: {
              create: {
                source: 'youtube',
                originalId: video.id,
              },
            },
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
      const url = `${this.API_URL}/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=300`;

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
      let filteredVideos = videoDetails.filter((video) => {
        const duration = this.parseISO8601Duration(
          video.contentDetails.duration,
        );
        return duration < 10 * 60; // Videos less than 10 minutes
      });

      //TODO: filter out previously imported videos. For this it is necessary to add original video id to the imported model
      const alreadyImported = await this.prismaService.imported.findMany({
        where: {
          AND: [
            {
              id: {
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
