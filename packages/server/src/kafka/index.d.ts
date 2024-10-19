import { TJobAction } from "@august-tv/common/types";
import { YoutubeImportRequestDto } from "../dto";
import { Job } from "@prisma/client";
export declare enum KafkaTopics {
    YouTubeImportRequested = "youtube-import-requested",
    JobsStatusUpdated = "job-status-updated"
}
export type KafkaPayloads = {
    [KafkaTopics.YouTubeImportRequested]: YoutubeImportRequestDto;
    [KafkaTopics.JobsStatusUpdated]: {
        action: TJobAction;
        job: Job;
        observers: string[];
    };
};
