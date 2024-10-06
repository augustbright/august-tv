"use client";

import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactHLSPlayer from "react-hls-player";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TVideoForEditingDto } from "types";
import { Loader, Save } from "lucide-react";
import { useMutateUpdateMedia } from "@/mutations/updateVideo";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { editedVideoIdAtom } from "./edit-video.modal";
import Link from "next/link";

const formSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .min(1, "Title is required")
        .max(255, "Title is too long"),
    description: z.string().max(1000, "Description is too long"),
    publish: z.boolean(),
});

export const EditVideoForm = ({ video }: { video: TVideoForEditingDto }) => {
    const [, setVideoId] = useAtom(editedVideoIdAtom);
    const playerRef = useRef<HTMLVideoElement>(null);
    const { mutateAsync: updateVideo, isPending: isUpdatingVideo } =
        useMutateUpdateMedia();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: video.title,
            description: video.description ?? "",
            publish: video.status === "PUBLISHED",
        },
        disabled: isUpdatingVideo,
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateVideo({
                id: video.id,
                updateVideoDto: values,
            });
            toast.success("Video updated");
            setVideoId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update video");
        }
    }

    return (
        <Form {...form}>
            <DialogContent className="max-w-5xl h-[600px] flex flex-col overflow-hidden">
                <form
                    className="flex flex-col grow"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Video settings
                            <Badge variant="default" className="ml-2">
                                {video.status}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Configure the settings of your video.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid flex-1 gap-4 overflow-auto grid-cols-3 grow">
                        <div className="flex-col items-start gap-8 flex col-span-2">
                            <div className="grid w-full items-start gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    placeholder="My awesome video"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    id="message"
                                                    placeholder="Describe your video..."
                                                    className="min-h-12 resize-none p-3"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* TODO tags */}
                                <FormField
                                    control={form.control}
                                    name="publish"
                                    render={({
                                        field: { value, onChange, ...field },
                                    }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Publish video
                                                </FormLabel>
                                                <FormDescription>
                                                    Make the video available to
                                                    the public
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    {...field}
                                                    checked={value}
                                                    onCheckedChange={onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex-col items-start flex gap-4">
                            {video.masterUrl && (
                                <ReactHLSPlayer
                                    className="w-full rounded-lg aspect-video"
                                    src={video.masterUrl}
                                    playerRef={playerRef}
                                    controls
                                />
                            )}
                            <div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Link to the video
                                    </p>
                                </div>
                                <Link
                                    href={`/v/${video.id}`}
                                    className="text-sm underline font-bold text-blue-600"
                                >
                                    {location.origin}/v/{video.id}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isUpdatingVideo}
                        >
                            {isUpdatingVideo ? (
                                <Loader className="animate-spin mr-2" />
                            ) : (
                                <Save className="mr-2" />
                            )}
                            <span>Save</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Form>
    );
};
