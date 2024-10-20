import { UserController } from "./rest/user/user.controller.js";
import { FeedController } from "./rest/feed/feed.controller.js";
import { JobsController } from "./rest/jobs/jobs.controller.js";
import { MediaController } from "./rest/media/media.controller.js";
import { SocketsController } from "./rest/sockets/sockets.controller.js";
import { YoutubeController } from "./rest/youtube/youtube.controller.js";
import { PatchMedia } from "./rest/media/media.dto.js";

import { YoutubeImportRequestDto } from "./dto/YoutubeImportRequestDto.js";

type TClass = abstract new (...args: any) => any;

type GetEndpointResult<
    T extends TClass,
    K extends keyof InstanceType<T>,
> = Awaited<ReturnType<InstanceType<T>[K]>>;

export type TUserEndpointResult<E extends keyof UserController> =
    GetEndpointResult<typeof UserController, E>;

export type TFeedEndpointResult<E extends keyof FeedController> =
    GetEndpointResult<typeof FeedController, E>;

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
            body: YoutubeImportRequestDto;
        };
    };
};
