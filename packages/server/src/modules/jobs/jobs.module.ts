import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { KafkaEmitterModule } from "../kafka-emitter/kafka-emitter.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule, KafkaEmitterModule.forRoot({ clientId: "jobs" })],
    providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}
