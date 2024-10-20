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
        jobId: payload.jobId,
        authorId: payload.authorId,
        dir: payload.dir,
        storageDir: payload.storageDir,
        thumbnailOriginalSize: payload.thumbnailOriginalSize,
        videoTitle: payload.videoTitle,
        videoDescription: payload.videoDescription,
        uploadImmediately: payload.publicImmediately,
      })
      .then((result) => {
        this.kafkaEmitterService.emit(
          KafkaTopics.YoutubeVideoForImportUploaded,
          {
            video: result.video,
          },
        );
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
