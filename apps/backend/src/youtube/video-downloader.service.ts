import { Injectable } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import * as fs from 'fs';
import { resolveUploadPath } from 'src/common/fs-utils';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { JobsService } from 'src/jobs/jobs.service';
import { randomUUID } from 'crypto';

@Injectable()
export class VideoDownloaderService {
  private readonly MAX_FILE_SIZE_MB = 50;
  constructor(
    private readonly socketsGateway: SocketsGateway,
    private readonly jobsService: JobsService,
  ) {}

  async downloadVideo(
    videoId: string,
    params: {
      observers: string[];
    },
  ) {
    const job = await this.jobsService.create(
      {
        name: 'Transferring a video from YouTube',
        description: `Transferring a video from YouTube with ID: ${videoId}`,
        stage: 'getting video info',
        payload: { videoId },
      },
      { observers: params.observers },
    );

    setImmediate(async () => {
      try {
        const { videoUrl, videoTitle, info } =
          await this.getStartingInfo(videoId);

        job.stage('choosing format');
        const format = ytdl.chooseFormat(info.formats, {
          quality: 'lowest',
          filter: 'audioandvideo',
        });

        if (!format) {
          job.error('No valid video formats available');
          return;
        }

        job.stage('downloading video');
        const filePath = resolveUploadPath(`${randomUUID()}.mp4`);
        job.metadata = { filePath, originalname: `${videoTitle}.mp4` };

        const videoStream = ytdl(videoUrl, { format });
        const writeStream = fs.createWriteStream(filePath);

        // Track download progress
        let downloadedBytes = 0;
        let lastProgress = 0;
        const totalBytes = this.calculateContentLength(format);

        videoStream.on('data', (chunk) => {
          downloadedBytes += chunk.length;

          const progress = totalBytes
            ? (downloadedBytes / totalBytes) * 100
            : null;

          if (progress !== null && progress - lastProgress > 5) {
            lastProgress = progress;
            job.progress(progress);
          }
        });

        videoStream.pipe(writeStream);
        writeStream.on('finish', () => {
          job.done();
        });
        writeStream.on('error', (error) => {
          job.error(error.message);
        });
      } catch {
        job.error('Failed to download video');
      }
    });

    return job;
  }

  private async getStartingInfo(videoId: string) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '');

    return { info, videoTitle, videoUrl };
  }

  private calculateContentLength(format: any): number {
    const bitrate = format.bitrate || 0; // in bits per second
    const durationMs = format.approxDurationMs
      ? parseInt(format.approxDurationMs)
      : 0; // in milliseconds
    const durationSeconds = durationMs / 1000; // Convert milliseconds to seconds

    // Calculate the content length (in bytes)
    const contentLengthBytes = (bitrate * durationSeconds) / 8; // Convert bits to bytes

    return Math.round(contentLengthBytes); // Return rounded value in bytes
  }
}
