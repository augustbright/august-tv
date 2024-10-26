import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ImageModule } from "../image/image.module";
import { JobsModule } from "../jobs/jobs.module";

@Module({
    imports: [PrismaModule, ImageModule, JobsModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
