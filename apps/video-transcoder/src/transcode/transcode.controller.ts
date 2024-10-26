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

  @EventPattern(KafkaTopics.VideoFileUploaded)
  handleVideoFileUploaded(
    payload: KafkaPayloads[KafkaTopics.VideoFileUploaded],
  ) {
    this.transcodeService
      .transcode({
        inputPath: payload.path,
        observers: payload.observers,
        authorId: payload.draft.authorId,
      })
      .then((result) => {
        this.kafkaEmitterService.emit(KafkaTopics.VideoFileTranscoded, {
          observers: payload.observers,
          dir: result.dir,
          storageDir: result.storageDir,
          thumbnailOriginalSize: result.thumbnailOriginalSize,
          draft: payload.draft,
          publicImmediately: payload.publicImmediately,
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
