import { Injectable, Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { ImageService, JobsService } from '@august-tv/server/modules';
import { ensureUploadPath } from '@august-tv/server/fs-utils';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { generateString } from '@august-tv/common';

const videosStorageDir = 'videos';

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
  observers: string[];
  inputPath: string;
  authorId: string;
  thumbnailUrl?: string;
};

@Injectable()
export class TranscodeService {
  private readonly logger = new Logger(TranscodeService.name);
  constructor(
    private readonly jobsService: JobsService,
    private readonly imageService: ImageService,
  ) {}

  async transcode(params: TParams) {
    return this.jobsService.wrap(
      {
        name: 'Processing video',
        type: 'process-video',
        stage: 'Transcoding',
        payload: {},
        observers: params.observers,
      },
      async (job) => {
        job.stage('Processing video');
        const percents = Array(resolutions.length).fill(0);
        const uuid = randomUUID();

        const videoFolderName = 'video';
        const thumbnailsFolderName = 'thumbnails';

        const dir = await ensureUploadPath(uuid);
        const videoOutputDir = await ensureUploadPath(uuid, videoFolderName);
        const thumbnailOutputDir = await ensureUploadPath(
          uuid,
          thumbnailsFolderName,
        );

        const isValid = await this.isVideoFileValid(params.inputPath);
        if (!isValid) {
          throw new Error('Invalid video file');
        }

        // Transcode video to different resolutions
        let error: Error | null = null;
        const transcodedFiles = Promise.all(
          resolutions.map((resolution, index) => {
            return new Promise<string>((resolve) => {
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
                  resolve(outputPath);
                  error = err;
                })
                .on('progress', (progress) => {
                  if (!progress.percent) return;

                  percents[index] = Math.round(progress.percent);
                  const total = percents.reduce((a, b) => a + b, 0);
                  const average = total / percents.length;
                  job.progress(average);
                  console.log(`Processing: ${average}%`);
                })
                .run();
            });
          }),
        );

        if (params.thumbnailUrl) {
          const thumbnailPath = path.join(
            thumbnailOutputDir,
            'thumbnail_1.png',
          );
          await this.imageService.downloadByUrl(
            params.thumbnailUrl,
            thumbnailPath,
          );
        } else {
          // Generate thumbnails
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
        }

        // Resize thumbnails to multiple sizes
        const thumbnailFilenames = await fs.readdir(thumbnailOutputDir);
        const thumbnailFilesPaths = thumbnailFilenames.map((filename) =>
          path.join(thumbnailOutputDir, filename),
        );
        const [{ originalHeight, originalWidth }] = await Promise.all(
          thumbnailFilesPaths.map((thumbnailPath) =>
            this.imageService.createMultipleSizes({
              originalPath: thumbnailPath,
            }),
          ),
        );

        await transcodedFiles;
        if (error) {
          throw error;
        }

        const folderName = generateString(10);
        const masterOutputPath = path.join(videoOutputDir, 'master.m3u8');
        const storageDir = [videosStorageDir, params.authorId, folderName].join(
          '/',
        );
        const streamFilesContent = resolutions.map((resolution) => {
          return [
            `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bandwidth},RESOLUTION=${resolution.size}`,
            `${storageDir}/${videoFolderName}/${resolution.resolution}_variant.m3u8`,
          ].join('\n');
        });
        const streamFiles = streamFilesContent.join('\n');
        const masterPlaylistContent = `#EXTM3U\n${streamFiles}`;
        await fs.writeFile(masterOutputPath, masterPlaylistContent);

        await fs.rename(params.inputPath, path.join(dir, 'original.mp4'));

        return {
          dir,
          storageDir,
          thumbnailOriginalSize: {
            height: originalHeight,
            width: originalWidth,
          },
        };
      },
    );
  }

  async isVideoFileValid(inputPath: string) {
    try {
      await fs.access(inputPath);
    } catch (error) {
      this.logger.error(`Invalid video file ${inputPath}: ${error}`);
      return error;
    }

    return new Promise((resolve) => {
      ffmpeg.ffprobe(inputPath, (error, metadata) => {
        if (error) {
          this.logger.error(`Invalid video file ${inputPath}: ${error}`);
          resolve(false);
        } else {
          const hasVideoStream = metadata.streams.some(
            (stream) => stream.codec_type === 'video',
          );
          if (hasVideoStream) {
            resolve(true);
          } else {
            this.logger.error(
              `Invalid video file ${inputPath}: no video stream`,
            );
            resolve(false);
          }
        }
      });
    });
  }
}
