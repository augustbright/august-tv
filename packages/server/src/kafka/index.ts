import { TJobAction } from "@august-tv/common/types";
import { YoutubeImportRequestDto } from "../dto";
import { Job, Video } from "@prisma/client";

export enum KafkaTopics {
    YouTubeImportRequested = "youtube-import-requested",
    JobsStatusUpdated = "job-status-updated",
    YoutubeVideoForImportDownloaded = "youtube-video-for-import-downloaded",
    YoutubeVideoForImportTranscoded = "youtube-video-for-import-transcoded",
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
    [KafkaTopics.YoutubeVideoForImportDownloaded]: {
        observers: string[];
        path: string;
        originalName: string;
        originalId: string;
        authorId: string;
        videoTitle: string;
        videoDescription: string;
        publicImmediately: boolean;
    };
    [KafkaTopics.YoutubeVideoForImportTranscoded]: {
        observers: string[];
        dir: string;
        storageDir: string;
        thumbnailOriginalSize: { width: number; height: number };
        originalName: string;
        originalId: string;
        authorId: string;
        videoTitle: string;
        videoDescription: string;
        publicImmediately: boolean;
    };
    [KafkaTopics.VideoFileUploaded]: {
        observers: string[];
        path: string;
        draft: Video;
    };
    [KafkaTopics.VideoFileTranscoded]: {
        observers: string[];
        dir: string;
        storageDir: string;
        thumbnailOriginalSize: { width: number; height: number };
        draft: Video;
    };
    [KafkaTopics.VideoIsReady]: {
        observers: string[];
        video: Video;
    };
};
