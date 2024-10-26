import { UserController } from "./rest/user/user.controller.js";
import { FeedController } from "./rest/feed/feed.controller.js";
import { JobsController } from "./rest/jobs/jobs.controller.js";
import { SocketsController } from "./rest/sockets/sockets.controller.js";
import { YoutubeController } from "./rest/youtube/youtube.controller.js";
import { TagsController } from "./rest/tags/tags.controller.js";
import { CategoriesController } from "./rest/categories/categories.controller.js";
import { VideoController } from "./rest/video/video.controller.js";

export {
    YoutubeImportRequestDto,
    PatchMediaDto,
    CreateTagDto,
    ImageCropDto,
    CategoryDto,
} from "./dto/index.js";

type TClass = abstract new (...args: any) => any;

type GetEndpointResult<
    T extends TClass,
    K extends keyof InstanceType<T>,
> = Awaited<ReturnType<InstanceType<T>[K]>>;

export type TTagsEndpointResult<E extends keyof TagsController> =
    GetEndpointResult<typeof TagsController, E>;

export type TUserEndpointResult<E extends keyof UserController> =
    GetEndpointResult<typeof UserController, E>;

export type TFeedEndpointResult<E extends keyof FeedController> =
    GetEndpointResult<typeof FeedController, E>;

export type TJobsEndpointResult<E extends keyof JobsController> =
    GetEndpointResult<typeof JobsController, E>;

export type TVideoEndpointResult<E extends keyof VideoController> =
    GetEndpointResult<typeof VideoController, E>;

export type TSocketsEndpointResult<E extends keyof SocketsController> =
    GetEndpointResult<typeof SocketsController, E>;

export type TYoutubeEndpointResult<E extends keyof YoutubeController> =
    GetEndpointResult<typeof YoutubeController, E>;

export type TCategoriesEndpointResult<E extends keyof CategoriesController> =
    GetEndpointResult<typeof CategoriesController, E>;
