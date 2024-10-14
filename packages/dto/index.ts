import { UserController } from "./types/src/user/user.controller.js";
import { FeedController } from "./types/src/feed/feed.controller.js";
import { ImageModule } from "./types/src/image/image.module.js";
import { JobsController } from "./types/src/jobs/jobs.controller.js";
import { MediaController } from "./types/src/media/media.controller.js";
import { SocketsController } from "./types/src/sockets/sockets.controller.js";
import { YoutubeController } from "./types/src/youtube/youtube.controller.js";

import { PatchMedia } from "./types/src/media/media.dto.js";
import { PostImportFromYoutube } from "./types/src/youtube/youtube.dto.js";

type TClass = abstract new (...args: any) => any;

type GetEndpointResult<
    T extends TClass,
    K extends keyof InstanceType<T>,
> = Awaited<ReturnType<InstanceType<T>[K]>>;

export type TUserEndpointResult<E extends keyof UserController> =
    GetEndpointResult<typeof UserController, E>;

export type TFeedEndpointResult<E extends keyof FeedController> =
    GetEndpointResult<typeof FeedController, E>;

export type TImageEndpointResult<E extends keyof ImageModule> =
    GetEndpointResult<typeof ImageModule, E>;

export type TJobsEndpointResult<E extends keyof JobsController> =
    GetEndpointResult<typeof JobsController, E>;

export type TMediaEndpointResult<E extends keyof MediaController> =
    GetEndpointResult<typeof MediaController, E>;

export type TSocketsEndpointResult<E extends keyof SocketsController> =
    GetEndpointResult<typeof SocketsController, E>;

export type TYoutubeEndpointResult<E extends keyof YoutubeController> =
    GetEndpointResult<typeof YoutubeController, E>;

export type Dto = {
    media: {
        patchMedia: {
            body: PatchMedia.Body;
        };
    };
    youtube: {
        postImportFromYoutube: {
            body: PostImportFromYoutube.Body;
        };
    };
};
