import { Video } from "@prisma/client";
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
      };
