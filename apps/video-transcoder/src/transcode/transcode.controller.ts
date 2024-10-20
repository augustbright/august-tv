import { KafkaPayloads, KafkaTopics } from '@august-tv/server/kafka';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TranscodeService } from './transcode.service';
import { KafkaEmitterService } from '@august-tv/server/modules';

@Controller('transcode')
export class TranscodeController {
  private readonly logger = new Logger(TranscodeController.name);
  constructor(
    private readonly transcodeService: TranscodeService,
    private readonly kafkaEmitterService: KafkaEmitterService,
  ) {}

  @EventPattern(KafkaTopics.YoutubeVideoForImportDownloaded)
  handleYoutubeVideoForImportDownloaded(
    payload: KafkaPayloads[KafkaTopics.YoutubeVideoForImportDownloaded],
  ) {
    this.transcodeService
      .transcode({
        inputPath: payload.path,
        jobId: payload.jobId,
      })
      .then((result) => {
        this.kafkaEmitterService.emit(
          KafkaTopics.YoutubeVideoForImportTranscoded,
          {
            authorId: payload.authorId,
            jobId: payload.jobId,
            originalname: payload.originalname,
            originalPath: payload.path,
            masterOutputPath: result.masterOutputPath,
            thumbnailOutputDir: result.thumbnailOutputDir,
            videoOutputDir: result.videoOutputDir,
          },
        );
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
