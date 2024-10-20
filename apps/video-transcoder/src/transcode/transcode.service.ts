import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile } from 'fs/promises';
import { JobsService } from '@august-tv/server/modules';
import { ensureUploadPath } from '@august-tv/server/fs-utils';
import { randomUUID } from 'crypto';
import path from 'path';

const resolutions = [
  // {
  //   resolution: '1080p',
  //   size: '1920x1080',
  //   bitrate: '4500k',
  //   bandwidth: 5090000,
  // },
  // {
  //   resolution: '720p',
  //   size: '1280x720',
  //   bitrate: '3000k',
  //   bandwidth: 3440000,
  // },
  {
    resolution: '480p',
    size: '854x480',
    bitrate: '1500k',
    bandwidth: 1790000,
  },
  {
    resolution: '360p',
    size: '640x360',
    bitrate: '800k',
    bandwidth: 1020000,
  },
];

const thumbnailsCount = 4;

type TParams = {
  jobId: string;
  inputPath: string;
};

@Injectable()
export class TranscodeService {
  private readonly logger = new Logger(TranscodeService.name);
  constructor(private readonly jobsService: JobsService) {}

  async transcode(params: TParams) {
    const job = await this.jobsService.getById(params.jobId);
    const processingJob = await this.jobsService.create(
      {
        name: 'Processing video',
        type: 'process-video',
        stage: 'Transcoding',
        payload: {},
      },
      { observers: job.observers },
    );
    await job.registerChildJob(processingJob);

    try {
      job.stage('Processing video');
      const percents = Array(resolutions.length).fill(0);
      const uuid = randomUUID();

      const videoFolderName = 'video';
      const thumbnailsFolderName = 'thumbnails';

      const videoOutputDir = await ensureUploadPath(uuid, videoFolderName);
      const thumbnailOutputDir = await ensureUploadPath(
        uuid,
        thumbnailsFolderName,
      );

      // Transcode video to different resolutions
      const transcodedFiles = Promise.all(
        resolutions.map((resolution, index) => {
          return new Promise<string>((resolve, reject) => {
            // const outputPath = path.join(
            //   videoOutputDir,
            //   `${resolution.resolution}.mp4`,
            // );
            const outputPath = path.join(
              videoOutputDir,
              `${resolution.resolution}_variant.m3u8`,
            );
            const segmentOutputPattern = path.join(
              videoOutputDir,
              `${resolution.resolution}_segment_%03d.ts`,
            );

            const outputOptions = [
              `-vf scale=${resolution.size}`,
              `-c:v libx264`,
              `-b:v ${resolution.bitrate}`,
              `-c:a aac`,
              `-strict -2`,
              `-hls_time 10`,
              `-hls_playlist_type vod`,
              `-hls_segment_filename ${segmentOutputPattern}`,
              `-f hls`,
            ];

            this.logger.log(
              [
                `🎬 Transcoding video to ${resolution.resolution}.`,
                `Transcoding options:`,
                outputOptions.join('\n'),
              ].join('\n'),
            );

            ffmpeg(params.inputPath)
              .outputOptions(outputOptions)
              .output(outputPath)
              .on('end', () => {
                this.logger.log(
                  `✅ Transcoding completed for ${resolution.resolution}`,
                );
                resolve(outputPath);
              })
              .on('error', (err: Error) => {
                this.logger.error(
                  `❌ Failed to transcode video to ${resolution.resolution}`,
                  err,
                );
                reject(err);
              })
              .on('progress', (progress) => {
                if (!progress.percent) return;

                percents[index] = Math.round(progress.percent);
                const total = percents.reduce((a, b) => a + b, 0);
                const average = total / percents.length;
                processingJob.progress(average);
                console.log(`Processing: ${average}%`);
              })
              .run();
          });
        }),
      );

      processingJob.stage('Generating thumbnails');
      await new Promise((resolve, reject) => {
        ffmpeg(params.inputPath)
          .on('end', () => resolve(null))
          .on('error', (err: Error) => reject(err))
          .screenshots({
            count: thumbnailsCount,
            folder: thumbnailOutputDir,
            filename: `thumbnail.png`,
            size: '1280x720',
          });
      });

      await transcodedFiles;

      // Generate master playlist file
      const masterName = `master.m3u8`;
      const masterOutputPath = path.join(videoOutputDir, masterName);
      const streamFilesContent = resolutions.map((resolution) => {
        return [
          `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bandwidth},RESOLUTION=${resolution.size}`,
          `transcoded/${uuid}/${videoFolderName}/${resolution.resolution}_variant.m3u8`,
        ].join('\n');
      });
      const streamFiles = streamFilesContent.join('\n');
      const masterPlaylistContent = `#EXTM3U\n${streamFiles}`;
      await writeFile(masterOutputPath, masterPlaylistContent);

      processingJob.done();
      job.done();

      return {
        videoOutputDir,
        thumbnailOutputDir,
        masterOutputPath,
      };
    } catch (error) {
      this.logger.error('Failed to transcode video', error);
      processingJob.error('Failed to process video');
      job.error('Failed to process video');
    }
  }
}
