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

  @EventPattern(KafkaTopics.YoutubeVideoForImportTranscoded)
  handleYoutubeVideoForImportTranscoded(
    payload: KafkaPayloads[KafkaTopics.YoutubeVideoForImportTranscoded],
  ) {
    this.uploadingService
      .uploadTranscodedVideo({
        observers: payload.observers,
        dir: payload.dir,
        storageDir: payload.storageDir,
      })
      .then((structured) => {
        return this.uploadingService.createDraft({
          authorId: payload.authorId,
          originalId: payload.originalId,
          structured,
          thumbnailOriginalSize: payload.thumbnailOriginalSize,
          uploadImmediately: payload.publicImmediately,
          videoDescription: payload.videoDescription,
          videoTitle: payload.videoTitle,
        });
      })
      .then((result) => {
        this.kafkaEmitterService.emit(KafkaTopics.VideoIsReady, {
          observers: payload.observers,
          video: result.video,
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

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
        });
      })
      .then((result) => {
        this.kafkaEmitterService.emit(KafkaTopics.VideoIsReady, {
          observers: payload.observers,
          video: result.video,
        });
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
