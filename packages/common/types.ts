import { Job, Video, Prisma } from "@prisma/client";
export type TMessage =
    | {
          type: "dummy-notification";
          message: string;
      }
    | {
          type: "upload-progress";
          video: Video;
          percent: number;
      }
    | {
          type: "upload-finished";
          video: Video;
      }
    | {
          type: "upload-error";
          video: Video;
          error: string;
      }
    | {
          type: "job-status";
          action: "created" | "updated" | "done" | "failed";
          job: Job;
      };

export type TCursorQueryParams = {
    cursor?: number;
    limit?: number;
};

export type TJobTestParams = {
    name: string;
    description?: string;
    payload?: Prisma.JsonObject;
    stage?: string;
    observers: string[];
    timeout: number;
};

export type TImportFromYoutubeParams = {
    authorId: string;
    channelId?: string;
    videoId?: string;
    numberOfVideos?: number;
    publicImmediately?: boolean;
    observers: string[];
};
