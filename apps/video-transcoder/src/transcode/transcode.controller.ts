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
        observers: payload.observers,
        authorId: payload.authorId,
      })
      .then((result) => {
        this.kafkaEmitterService.emit(
          KafkaTopics.YoutubeVideoForImportTranscoded,
          {
            authorId: payload.authorId,
            observers: payload.observers,
            originalName: payload.originalName,
            videoDescription: payload.videoDescription,
            videoTitle: payload.videoTitle,
            dir: result.dir,
            storageDir: result.storageDir,
            thumbnailOriginalSize: result.thumbnailOriginalSize,
            publicImmediately: payload.publicImmediately,
          },
        );
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
