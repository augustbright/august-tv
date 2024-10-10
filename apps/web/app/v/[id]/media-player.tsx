"use client";

import { useQueryMedia } from "@/queries/media";
import { Loader, Loader2 } from "lucide-react";
import { useRef } from "react";
import ReactHlsPlayer from "react-hls-player";

export const MediaPlayer = ({ mediaId }: { mediaId: string }) => {
    const { data: media, isLoading } = useQueryMedia(mediaId);
    const playerRef = useRef<HTMLVideoElement>(null);
    if (isLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (!media) {
        return null;
    }

    return (
        <ReactHlsPlayer
            className="h-[600px] rounded-lg aspect-video"
            src={media?.masterUrl || ""}
            playerRef={playerRef}
            controls
            autoPlay
        />
    );
};
