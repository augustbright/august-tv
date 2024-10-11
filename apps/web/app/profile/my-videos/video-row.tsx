import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Loader, MoreHorizontal, Trash } from "lucide-react";
import { useEditVideoModal } from "@/app/_edit_video_modal/edit-video.modal";
import Link from "next/link";
import { VideoThumbnail } from "@/components/video-thumbnail";
import { useMutateDeleteVideoById } from "@/mutations/deleteVideoById";
import { useConfirm } from "@/app/confirm";
import { DTO } from "@august-tv/dto";

export const VideoRow = ({
    video,
}: {
    video: DTO["media"]["getMyMedia"]["response"]["data"][0];
}) => {
    const editVideo = useEditVideoModal();
    const confirm = useConfirm();
    const { mutateAsync: deleteVideoById, isPending: isDeletingVideo } =
        useMutateDeleteVideoById();
    return (
        <TableRow
            onClick={() => {
                editVideo(video.id);
            }}
        >
            <TableCell className="hidden sm:table-cell">
                {video.status === "ERROR" && (
                    <p className="flex w-[200px] aspect-video justify-center items-center text-gray-500">
                        Preview is not available
                    </p>
                )}
                {video.status !== "ERROR" && (
                    <VideoThumbnail
                        thumbnail={video.thumbnail}
                        alt={video.title}
                    />
                )}
            </TableCell>
            <TableCell className="font-medium">
                {video.status === "READY" ? (
                    <Link
                        href={`/v/${video.id}`}
                        className="text-sm underline font-bold text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {video.title}
                    </Link>
                ) : (
                    video.title
                )}
            </TableCell>
            <TableCell>
                {/* TODO: Good status badges */}
                <Badge
                    variant={
                        video.status === "ERROR" ? "destructive" : "outline"
                    }
                >
                    {video.status === "PROCESSING" && (
                        <Loader className="mr-2 w-3 h-3 animate-spin" />
                    )}
                    {video.status}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {/* TODO: good date formatter (like, "3 days ago", etc)  */}
                {new Date(video.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
                {/*TODO: Video actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                confirm({
                                    description:
                                        "This video will be deleted permanently.",
                                    continueText: "Delete",
                                    onContinue: () => {
                                        deleteVideoById(video.id);
                                    },
                                });
                            }}
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};
