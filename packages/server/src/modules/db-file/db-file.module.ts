import { Module } from "@nestjs/common";
import { DbFileService } from "./db-file.service";
import { StorageModule } from "../storage/storage.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [StorageModule, PrismaModule],
    providers: [DbFileService],
    exports: [DbFileService],
})
export class DbFileModule {}
