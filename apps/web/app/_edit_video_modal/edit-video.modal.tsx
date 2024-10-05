"use client";
import { Dialog } from "@/components/ui/dialog";
import { atom, useAtom } from "jotai";
import { useQueryVideoForEditing } from "@/queries/videoForEditing";
import { EditVideoForm } from "./edit-video-form";

export const editedVideoIdAtom = atom<string | null>(null);

export const EditVideoModal = () => {
    const [videoId, setVideoId] = useAtom(editedVideoIdAtom);
    const { data: video } = useQueryVideoForEditing(videoId);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setVideoId(null);
        }
    };
    return (
        <Dialog open={!!videoId} onOpenChange={handleOpenChange}>
            {video && <EditVideoForm video={video} />}
        </Dialog>
    );
};

export const useEditVideoModal = () => {
    const [, setVideoId] = useAtom(editedVideoIdAtom);
    return (videoId: string) => {
        setVideoId(videoId);
    };
};
