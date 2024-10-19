import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { StorageModule } from "../storage/storage.module";
import { PrismaModule } from "../prisma/prisma.module";
import { DbFileModule } from "../db-file/db-file.module";

@Module({
    imports: [StorageModule, PrismaModule, DbFileModule],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
