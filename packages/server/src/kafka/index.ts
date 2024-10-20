import { TJobAction } from "@august-tv/common/types";
import { YoutubeImportRequestDto } from "../dto";
import { Job } from "@prisma/client";

export enum KafkaTopics {
    YouTubeImportRequested = "youtube-import-requested",
    JobsStatusUpdated = "job-status-updated",
    YoutubeVideoForImportDownloaded = "youtube-video-for-import-downloaded",
    YoutubeVideoForImportTranscoded = "youtube-video-for-import-transcoded",
}

export type KafkaPayloads = {
    [KafkaTopics.YouTubeImportRequested]: YoutubeImportRequestDto;
    [KafkaTopics.JobsStatusUpdated]: {
        action: TJobAction;
        job: Job;
        observers: string[];
    };
    [KafkaTopics.YoutubeVideoForImportDownloaded]: {
        jobId: string;
        path: string;
        originalName: string;
        authorId: string;
    };
    [KafkaTopics.YoutubeVideoForImportTranscoded]: {
        jobId: string;
        dir: string;
        originalName: string;
        authorId: string;
    };
};
