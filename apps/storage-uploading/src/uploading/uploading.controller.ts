import { KafkaPayloads, KafkaTopics } from '@august-tv/server/kafka';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UploadingService } from './uploading.service';
import { KafkaEmitterService } from '@august-tv/server/modules';

@Controller('uploading')
export class UploadingController {
  private readonly logger = new Logger(UploadingController.name);
  constructor(
    private readonly uploadingService: UploadingService,
    private readonly kafkaEmitterService: KafkaEmitterService,
  ) {}

  @EventPattern(KafkaTopics.VideoFileTranscoded)
  handleVideoFileTranscoded(
    payload: KafkaPayloads[KafkaTopics.VideoFileTranscoded],
  ) {
    this.uploadingService
      .uploadTranscodedVideo({
        observers: payload.observers,
        dir: payload.dir,
        storageDir: payload.storageDir,
      })
      .then((structured) => {
        return this.uploadingService.updateDraft({
          draft: payload.draft,
          structured,
          thumbnailOriginalSize: payload.thumbnailOriginalSize,
          publicImmediately: payload.publicImmediately,
        });
      })
      .then((result) => {
        this.kafkaEmitterService.emit(KafkaTopics.VideoIsReady, {
          observers: payload.observers,
          video: result.video,
          publicImmediately: payload.publicImmediately,
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
