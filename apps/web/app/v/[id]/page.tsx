import { MediaInfo } from "./media-info";
import { MediaPlayer } from "./media-player";

export default function Index({ params }: { params: { id: string } }) {
    return (
        <main className="flex flex-col gap-2">
            <MediaPlayer mediaId={params.id} />
            <MediaInfo mediaId={params.id} />
            {/* TODO: views */}
            {/* TODO: subscription */}
            {/* TODO: likes/dislikes */}
            {/* TODO: report */}
        </main>
    );
}
