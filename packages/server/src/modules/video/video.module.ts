import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ImageModule } from "../image/image.module";
import { DbFileModule } from "../db-file/db-file.module";
import { JobsModule } from "../jobs/jobs.module";
import { KafkaEmitterModule } from "../kafka-emitter/kafka-emitter.module";
import { VideoService } from "./video.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        UserModule,
        PrismaModule,
        ImageModule,
        DbFileModule,
        JobsModule,
        KafkaEmitterModule.forRoot({
            clientId: "video",
        }),
    ],
    providers: [VideoService],
    exports: [VideoService],
})
export class VideoModule {}
