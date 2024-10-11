import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { DTO } from "@august-tv/dto";
import moment from "moment";
import Link from "next/link";

export const FeedThumbnail = ({
    video,
}: {
    video: NonNullable<DTO["feed"]["getLatestFeed"]["response"]["data"][0]>;
}) => {
    return (
        <Link
            href={`/v/${video.id}`}
            className="display: flex flex-col gap-2 hover:bg-slate-200 dark:hover:bg-slate-950 p-4 rounded-lg"
        >
            <VideoThumbnail
                thumbnail={video.thumbnail}
                alt={video.title}
                width={400}
                height={400}
            />
            <div className="flex gap-2">
                <Avatar>
                    <AvatarImage
                        src={video.author.picture?.small?.publicUrl}
                        alt={video.author.nickname}
                    />
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-sm">{video.author.nickname}</p>
                    <p className="text-sm">
                        {moment(video.createdAt).format("MMMM Do, YYYY")}
                    </p>
                </div>
            </div>
        </Link>
    );
};
