"use client";

// TODO Video categories
// TODO: handle statuses&visibility: ERROR, PROCESSING, READY, etc

import { Button } from "@/components/ui/button";
import {
    DialogClose,
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useMutateUpdateMedia } from "@/mutations/updateVideo";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Video, File } from "@prisma/client";

const formSchema = z.object({
    title: z
        .string({
            required_error: "Title is required",
        })
        .min(1, "Title is required")
        .max(255, "Title is too long"),
    description: z.string().max(1000, "Description is too long"),
    visibility: z.enum(["PRIVATE", "UNLISTED", "PUBLIC"], {
        required_error: "Please select a visibility option",
    }),
});

export const EditVideoForm = ({
    video,
}: {
    video: Pick<
        Video,
        "id" | "title" | "visibility" | "description" | "status"
    > & { master: Pick<File, "publicUrl"> | null };
}) => {
    const router = useRouter();
    const playerRef = useRef<HTMLVideoElement>(null);
    const { mutateAsync: updateVideo, isPending: isUpdatingVideo } =
        useMutateUpdateMedia();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: video.title,
            description: video.description ?? "",
            visibility:
                video.visibility === "DRAFT" ? undefined : video.visibility,
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
            router.push("/profile/my-videos");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update video");
        }
    }

    return (
        <Form {...form}>
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
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Publish video
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <RadioGroup {...field}>
                                                <div className="flex items-start space-x-2">
                                                    <RadioGroupItem
                                                        value="PRIVATE"
                                                        id="private"
                                                        className="mt-1"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "visibility",
                                                                "PRIVATE"
                                                            );
                                                        }}
                                                    />
                                                    <Label htmlFor="private">
                                                        Private
                                                        <p className="text-sm text-gray-500">
                                                            Only you can view
                                                            the video
                                                        </p>
                                                    </Label>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <RadioGroupItem
                                                        value="PUBLIC"
                                                        id="public"
                                                        className="mt-1"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "visibility",
                                                                "PUBLIC"
                                                            );
                                                        }}
                                                    />
                                                    <Label htmlFor="public">
                                                        Public
                                                        <p className="text-sm text-gray-500">
                                                            Everyone can view
                                                            the video
                                                        </p>
                                                    </Label>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <RadioGroupItem
                                                        value="UNLISTED"
                                                        id="unlisted"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "visibility",
                                                                "UNLISTED"
                                                            );
                                                        }}
                                                    />
                                                    <Label htmlFor="unlisted">
                                                        Unlisted
                                                        <p className="text-sm text-gray-500">
                                                            Only people with the
                                                            link can view the
                                                            video
                                                        </p>
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* TODO: thumbnail selector for videos */}
                        </div>
                    </div>
                    <div className="flex-col items-start flex gap-4">
                        {video.master && (
                            <ReactHLSPlayer
                                className="w-full rounded-lg aspect-video"
                                src={video.master.publicUrl}
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
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            <Save className="mr-2" />
                        )}
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};
