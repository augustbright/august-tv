// TODO: Implement media transcode microservice
import { env } from "@august-tv/env";

import { Injectable } from "@nestjs/common";
import { Storage, TransferManager } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import * as fs from "fs/promises";
import { Prisma, Video } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ImageService } from "../image/image.service";
import { JobsService } from "../jobs/jobs.service";
import { ensureUploadPath, resolveUploadPath } from "../../fs-utils";
import * as path from "path";
import { Job } from "../jobs/Job";

const storage = new Storage();
const bucketName = env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME;
const transferManager = new TransferManager(storage.bucket(bucketName));

export type TTempFile = {
    originalname: string;
    path: string;
};

@Injectable()
export class MediaUploadService {
    private readonly MAX_FILE_SIZE_MB = 50;
    constructor(
        private readonly prisma: PrismaService,
        private readonly imageService: ImageService,
        private readonly jobsService: JobsService
    ) {}

    async upload(
        file: TTempFile,
        authorId: string,
        params: {
            observers: string[];
        }
    ) {
        const { size } = await fs.stat(file.path);
        if (size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
            throw new Error("File is too big");
        }

        const video = await this.prisma.video.create({
            data: {
                author: {
                    connect: { id: authorId },
                },
                title: file.originalname,
                thumbnailSet: {
                    create: {},
                },
                fileSet: {
                    create: {},
                },
            },
        });

        const job = await this.jobsService.create(
            {
                name: "Processing video",
                stage: "transcoding",
                description: `We are currently processing ${file.originalname}`,
                type: "process-video",
                payload: {
                    videoId: video.id,
                },
            },
            {
                observers: params.observers,
            }
        );

        this.processVideo(file, video, job);

        return {
            job,
            video,
        };
    }

    private async processVideo(file: TTempFile, video: Video, job: Job) {
        async function getManyFiles(folder: string, ending: string) {
            const allFiles = await fs.readdir(`${outputFolder}${folder}`);
            return allFiles
                .map((file) => `${outputFolder}${folder}/${file}`)
                .filter((file) => file.endsWith(ending));
        }

        const uploadManyFiles = async (files: string[], fileSetId: string) => {
            const responses = await transferManager.uploadManyFiles(files, {
                customDestinationBuilder(path) {
                    const relPath = path.split(outputFolder).at(-1);
                    return `transcoded/${filename}/${relPath}`;
                },
            });
            const dbFilesCreateManyInput: Prisma.FileCreateManyInput[] =
                responses.map(
                    ([storageFile]) =>
                        ({
                            filename: path.basename(storageFile.name),
                            path: storageFile.name,
                            publicUrl: storageFile.publicUrl(),
                            fileSetId,
                        }) satisfies Prisma.FileCreateManyInput
                );

            const dbFiles = await this.prisma.file.createManyAndReturn({
                data: dbFilesCreateManyInput,
            });

            return dbFiles;
        };

        const fileUUID = randomUUID();
        const filename = `${fileUUID}`;
        const rootOutputFolder = resolveUploadPath(fileUUID);
        ensureUploadPath(fileUUID);
        const outputFolder = `${rootOutputFolder}/`;
        const tempFilePath = file.path;

        try {
            // const transcoded = await this.transcodeService.transcode(
            //     tempFilePath,
            //     {
            //         onProgress: (percent) => {
            //             job.progress(percent);
            //         },
            //         outputFolder,
            //         filename,
            //     }
            // );
            // const videoVariantFiles = await getManyFiles(
            //     transcoded.videoFolder,
            //     "_variant.m3u8"
            // );
            // const videoPartsFiles = await getManyFiles(
            //     transcoded.videoFolder,
            //     ".ts"
            // );
            // const videoMasterFiles = await getManyFiles(
            //     transcoded.videoFolder,
            //     "_master.m3u8"
            // );
            // const thumbnailsFilenames = await Promise.all(
            //     (await getManyFiles(transcoded.thumbnailsFolder, ".png")).map(
            //         async (thumbnail) => {
            //             const thumbnailName =
            //                 randomUUID() + path.extname(thumbnail);
            //             await fs.rename(
            //                 thumbnail,
            //                 resolveUploadPath(thumbnailName)
            //             );
            //             return thumbnailName;
            //         }
            //     )
            // );
            // job.stage("uploading files");
            // await uploadManyFiles(videoVariantFiles, video.fileSetId);
            // await uploadManyFiles(videoPartsFiles, video.fileSetId);
            // const [uploadedMaster] = await uploadManyFiles(
            //     videoMasterFiles,
            //     video.fileSetId
            // );
            // const dbThumbnails = await Promise.all(
            //     thumbnailsFilenames.map((thumbnailFilename) =>
            //         this.imageService.upload(thumbnailFilename, {
            //             ownerId: video.authorId,
            //             setId: video.thumbnailSetId,
            //         })
            //     )
            // );
            // await this.prisma.video.update({
            //     where: { id: video.id },
            //     data: {
            //         status: "READY",
            //         master: {
            //             connect: {
            //                 id: uploadedMaster.id,
            //             },
            //         },
            //         thumbnail: {
            //             connect: {
            //                 id: dbThumbnails[0].id,
            //             },
            //         },
            //     },
            // });
            // job.done();
        } catch (error) {
            await this.prisma.video.update({
                where: { id: video.id },
                data: { status: "ERROR" },
            });

            job.error(String(error));
        } finally {
            await fs.rm(rootOutputFolder, { recursive: true });
            await fs.rm(file.path);
        }
    }
}
