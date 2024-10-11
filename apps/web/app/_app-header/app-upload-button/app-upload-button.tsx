"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Upload, Loader2, CirclePlus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useMutateUploadMedia } from "@/mutations/uploadMedia";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Guard } from "@/components/guard";
import { AppUploadUnauthenticated } from "./app-upload-unauthenticated";
import { Query } from "@/components/Query";
import { Icon } from "@/components/icon";
import { useRouter } from "next/navigation";

export const AppUploadButton = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const uploadMedia = useMutateUploadMedia();
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        router.push("/profile/my-videos");
        const result = await uploadMedia.mutateAsync(file);
        router.push(`/profile/my-videos/edit/${result.id}`);
        if (result) {
            setOpen(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            uploadMedia.reset();
        }
        setOpen(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CirclePlus className="mr-2 h-5 w-5" />
                    <span>Upload</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Guard
                    fallback={<AppUploadUnauthenticated />}
                    loading={Query.LOADING.ROW}
                    error={Query.ERROR.ALERT}
                >
                    {() => (
                        <>
                            <DialogHeader>
                                <DialogTitle>Upload a video</DialogTitle>
                                <DialogDescription>
                                    Choose a video file from your device to
                                    upload.
                                </DialogDescription>
                            </DialogHeader>
                            <Button asChild>
                                <label htmlFor="file">
                                    <Icon
                                        icon={Upload}
                                        loading={uploadMedia.isPending}
                                        className="mr-2 h-4 w-4"
                                    />
                                    <span>Choose file</span>
                                </label>
                            </Button>
                            {uploadMedia.isPending && (
                                <Alert variant="default">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <AlertTitle>Uploading...</AlertTitle>
                                    <AlertDescription>
                                        Your video is being uploaded
                                    </AlertDescription>
                                </Alert>
                            )}
                            {uploadMedia.error && !uploadMedia.isPending && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {uploadMedia.error.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <input
                                className="hidden"
                                id="file"
                                name="file"
                                accept="video/*"
                                type="file"
                                disabled={uploadMedia.isPending}
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </Guard>
            </DialogContent>
        </Dialog>
    );
};
