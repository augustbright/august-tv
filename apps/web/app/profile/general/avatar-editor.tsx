"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutateUpdateProfilePicture } from "@/mutations/updateProfilePicture";
import { CameraOff, Check, Upload } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const AvatarEditor = () => {
    const { mutate: updateProfilePicture } = useMutateUpdateProfilePicture();
    const currentAvatar = null;
    const [file, setFile] = useState<File>(null);
    const [pictureUpdated, setPictureUpdated] = useState(false);
    const fileUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : null),
        [file]
    );

    const displayedAvatar = fileUrl;
    let showUploadButton = true;
    let showConfirmButton = false;

    let dialogTitle = "Profile picture";
    let dialogDescription = `A picture helps people recognize you and lets you know when you're signed in to your account`;

    if (file) {
        dialogTitle = "Use this picture?";
        dialogDescription = `This will be your new profile picture`;
        showUploadButton = false;
        showConfirmButton = true;
    }
    if (pictureUpdated) {
        dialogTitle = "Profile picture updated";
        dialogDescription = "";
        showUploadButton = false;
        showConfirmButton = false;
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        setFile(file);
    };

    const handleConfirm = async () => {
        try {
            await updateProfilePicture(file);
            setPictureUpdated(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile picture");
        }
        // console.log(result);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // changeAvatar.reset();
            setFile(null);
            setPictureUpdated(false);
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Avatar className="size-52 cursor-pointer">
                    <AvatarImage />
                    <AvatarFallback>
                        <CameraOff />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="gap-8">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                    <Avatar className="size-52">
                        <AvatarImage src={displayedAvatar} />
                        <AvatarFallback>
                            <CameraOff />
                        </AvatarFallback>
                    </Avatar>
                </div>
                <DialogFooter className="flex">
                    {showUploadButton && (
                        <>
                            <Button asChild>
                                <label htmlFor="file" className="grow">
                                    <Upload className="mr-2 h-4 w-4" />
                                    <span>Add profile picture</span>
                                </label>
                            </Button>
                            <input
                                className="hidden"
                                id="file"
                                name="file"
                                accept="image/png"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                    {showConfirmButton && (
                        <Button
                            className="grow"
                            onClick={() => handleConfirm()}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            <span>Use this picture</span>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
