import { Module } from "@nestjs/common";
import { MediaUploadService } from "./media-upload.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ImageModule } from "../image/image.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
    imports: [PrismaModule, ImageModule, JobsModule],
    providers: [MediaUploadService],
    exports: [MediaUploadService],
})
export class MediaUploadModule {}
