"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditVideoForm } from "./edit-video-form";
import { Query } from "@/components/Query";
import { queryMedia } from "@/queries/media";
import { useRouter } from "next/navigation";

export const EditVideoModal = ({ videoId }: { videoId: string }) => {
    const router = useRouter();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.push("/profile/my-videos");
        }
    };
    return (
        <Dialog open onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-5xl h-[600px] flex flex-col overflow-hidden">
                <Query
                    query={queryMedia(videoId)}
                    loading={Query.LOADING.ROW}
                    error={Query.ERROR.ALERT}
                >
                    {({ data: video }) => <EditVideoForm video={video} />}
                </Query>
            </DialogContent>
        </Dialog>
    );
};

export const useEditVideoModal = () => {
    const router = useRouter();
    return (videoId: string) => {
        router.push(`/profile/my-videos/edit/${videoId}`, {
            scroll: false,
        });
    };
};
