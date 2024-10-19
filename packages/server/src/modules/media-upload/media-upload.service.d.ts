import { PrismaService } from "../prisma/prisma.service";
import { TranscodeService } from "../transcode/transcode.service";
import { ImageService } from "../image/image.service";
import { JobsService } from "../jobs/jobs.service";
export type TTempFile = {
    originalname: string;
    path: string;
};
export declare class MediaUploadService {
    private readonly prisma;
    private readonly transcodeService;
    private readonly imageService;
    private readonly jobsService;
    private readonly MAX_FILE_SIZE_MB;
    constructor(prisma: PrismaService, transcodeService: TranscodeService, imageService: ImageService, jobsService: JobsService);
    upload(file: TTempFile, authorId: string, params: {
        observers: string[];
    }): Promise<{
        job: import("..").Job;
        video: {
            description: string | null;
            title: string;
            authorId: string;
            id: string;
            cursor: number;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            deletedAt: Date | null;
            deleted: boolean;
            status: import(".prisma/client").$Enums.VideoStatus;
            visibility: import(".prisma/client").$Enums.Visibility;
            viewsCount: number;
            likesCount: number;
            dislikesCount: number;
            thumbnailId: string | null;
            thumbnailSetId: string;
            masterId: string | null;
            fileSetId: string;
        };
    }>;
    private processVideo;
}
