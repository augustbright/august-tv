import { Injectable } from "@nestjs/common";
import ffmpeg from "fluent-ffmpeg";
import { writeFile } from "fs/promises";
import { ensureDir } from "../../fs-utils";

const resolutions = [
    // {
    //   resolution: '1080p',
    //   size: '1920x1080',
    //   bitrate: '4500k',
    //   bandwidth: 5090000,
    // },
    // {
    //   resolution: '720p',
    //   size: '1280x720',
    //   bitrate: '3000k',
    //   bandwidth: 3440000,
    // },
    {
        resolution: "480p",
        size: "854x480",
        bitrate: "1500k",
        bandwidth: 1790000,
    },
    {
        resolution: "360p",
        size: "640x360",
        bitrate: "800k",
        bandwidth: 1020000,
    },
];

const thumbnailsCount = 4;

interface TConfig {
    onProgress: (percent: number) => void;
    outputFolder: string;
    filename: string;
}

@Injectable()
export class TranscodeService {
    constructor() {}

    async transcode(inputPath: string, config: TConfig) {
        try {
            return await this.transcodeForStreaming(inputPath, config);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async transcodeForStreaming(
        inputPath: string,
        { outputFolder, onProgress, filename }: TConfig
    ) {
        const videoFolder = "video";
        const thumbnailsFolder = "thumbnails";
        const percents = Array(resolutions.length).fill(0);

        const videoOutputFolder = await ensureDir(
            `${outputFolder}${videoFolder}/`
        );
        const thumbnailOutputFolder = await ensureDir(
            `${outputFolder}${thumbnailsFolder}/`
        );

        // Transcode video to different resolutions
        const transcodedFiles = await Promise.all(
            resolutions.map((resolution, index) => {
                return new Promise<string>((resolve, reject) => {
                    const output = `${videoOutputFolder}${filename}_${resolution.resolution}_variant.m3u8`;

                    ffmpeg(inputPath)
                        .outputOptions([
                            `-vf scale=${resolution.size}`,
                            `-c:v libx264`,
                            `-b:v ${resolution.bitrate}`,
                            `-c:a aac`,
                            `-strict -2`,
                            `-hls_time 10`,
                            `-hls_playlist_type vod`,
                            `-hls_segment_filename ${videoOutputFolder}${filename}_${resolution.resolution}_segment_%03d.ts`,
                        ])
                        .output(output)
                        .on("end", () => {
                            console.log(
                                `Transcoding completed for ${resolution.resolution}`
                            );
                            resolve(output);
                        })
                        .on("error", (err: Error) => {
                            console.error(
                                `Error transcoding for ${resolution.resolution}: ${err.message}`
                            );
                            reject(err);
                        })
                        .on("progress", (progress) => {
                            if (!progress.percent) return;

                            percents[index] = Math.round(progress.percent);
                            const total = percents.reduce((a, b) => a + b, 0);
                            const average = total / percents.length;
                            onProgress(average);
                            console.log(`Processing: ${average}%`);
                        })
                        .run();
                });
            })
        );

        // Create thumbnails
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .on("end", () => resolve(null))
                .on("error", (err: Error) => reject(err))
                .thumbnail({
                    count: thumbnailsCount,
                    filename: `${thumbnailOutputFolder}${filename}_thumbnail.png`,
                    size: "1280x720",
                });
        });

        await transcodedFiles;

        // Generate master playlist file
        const masterName = `${filename}_master.m3u8`;
        const masterPlaylist = `${videoOutputFolder}${masterName}`;
        const streamFilesContent = resolutions.map((resolution) => {
            return `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bandwidth},RESOLUTION=${resolution.size}\ntranscoded/${filename}/${videoFolder}/${filename}_${resolution.resolution}_variant.m3u8`;
        });
        const streamFiles = streamFilesContent.join("\n");
        const masterPlaylistContent = `#EXTM3U\n${streamFiles}`;
        await writeFile(masterPlaylist, masterPlaylistContent);

        return {
            videoFolder,
            thumbnailsFolder,
            masterName,
        };
    }
}
