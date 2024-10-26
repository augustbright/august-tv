import { TJobAction } from "@august-tv/common/types";
import { YoutubeImportRequestDto } from "../dto";
import { Job, Video } from "@prisma/client";

export enum KafkaTopics {
    YouTubeImportRequested = "youtube-import-requested",
    JobsStatusUpdated = "job-status-updated",
    VideoFileUploaded = "video-file-uploaded",
    VideoFileTranscoded = "video-file-transcoded",
    VideoIsReady = "video-is-ready",
}

export type KafkaPayloads = {
    [KafkaTopics.YouTubeImportRequested]: YoutubeImportRequestDto;
    [KafkaTopics.JobsStatusUpdated]: {
        observers: string[];
        action: TJobAction;
        job: Job;
    };
    [KafkaTopics.VideoFileUploaded]: {
        observers: string[];
        path: string;
        draft: Video;
        thumbnailUrl?: string;
        publicImmediately: boolean;
    };
    [KafkaTopics.VideoFileTranscoded]: {
        observers: string[];
        dir: string;
        storageDir: string;
        thumbnailOriginalSize: { width: number; height: number };
        draft: Video;
        publicImmediately: boolean;
    };
    [KafkaTopics.VideoIsReady]: {
        observers: string[];
        video: Video;
        publicImmediately: boolean;
    };
};
