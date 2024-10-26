import { Module } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
