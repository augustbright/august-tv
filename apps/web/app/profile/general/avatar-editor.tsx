"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { useMutateUploadProfilePicture } from "@/mutations/uploadProfilePicture";
import {
    CameraOff,
    ChevronLeft,
    CircleUserRound,
    Pen,
    Sparkles,
    Trash,
    Upload,
} from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { checkExhaustiveness } from "@august-tv/common";
import { useMutateUnsetProfilePicture } from "@/mutations/unsetProfilePicture";
import { AvatarGallery } from "./avatar-gallery";
import { useQueryProfilePictures } from "@/queries/profilePictures";
import { AvatarTuner } from "./avatar-tuner";
import { Crop } from "react-image-crop";
import { CroppedImage } from "./cropped-image";
import { DTO } from "@august-tv/dto";
import { useMutateUpdateProfilePicture } from "@/mutations/updateProfilePicture";
import { Icon } from "@/components/icon";

enum DialogPage {
    HOME,
    CHANGE_PICTURE,
    TUNE_PICTURE,
    PREVIEW_PICTURE,
    PICTURE_UPDATED,
}

type TDialogState = {
    avatar: boolean;
    tuner: boolean;
    preview: boolean;
    result: boolean;
    uploadButton: boolean;
    changeButton: boolean;
    removeButton: boolean;
    backButton: boolean;
    avatarGallery: boolean;

    title: string;
    description: string;
};

export const AvatarEditor = () => {
    const { current } = useUser();
    const [page, setPage] = useState<DialogPage>(DialogPage.HOME);

    const [selectedImageFromGallery, setSelectedImageFromGallery] = useState<
        DTO["user"]["getProfilePictures"]["response"]["images"][number] | null
    >(null);
    const [localFile, setLocalFile] = useState<File | null>(null);

    const localFileUrl = useMemo(
        () => (localFile ? URL.createObjectURL(localFile) : null),
        [localFile]
    );
    const selectedImageUrl = selectedImageFromGallery
        ? selectedImageFromGallery.original.publicUrl
        : localFileUrl;

    const { data: pictures } = useQueryProfilePictures();
    const hasPictures = !!pictures?.images.length;
    const {
        mutateAsync: uploadProfilePicture,
        isPending: isUploadingProfilePicture,
    } = useMutateUploadProfilePicture();
    const {
        mutateAsync: updateProfilePicture,
        isPending: isUpdatingProfilePicture,
    } = useMutateUpdateProfilePicture();
    const {
        mutateAsync: unsetProfilePicture,
        isPending: isRemovingProfilePicture,
    } = useMutateUnsetProfilePicture();
    const currentPicture = current?.data?.picture;
    const [crop, setCrop] = useState<Crop>({
        height: 0,
        unit: "px",
        width: 0,
        x: 0,
        y: 0,
    });

    let dialogState: TDialogState = {
        avatar: false,
        tuner: false,
        preview: false,
        result: false,
        uploadButton: false,
        changeButton: false,
        removeButton: false,
        backButton: false,
        avatarGallery: false,

        title: "",
        description: "",
    };

    switch (page) {
        case DialogPage.HOME:
            switch (!!currentPicture) {
                case true:
                    dialogState = {
                        title: "Profile picture",
                        description: `A picture helps people recognize you and lets you know when you're signed in to your account`,

                        avatar: true,
                        tuner: false,
                        preview: false,
                        result: false,
                        uploadButton: !hasPictures,
                        changeButton: hasPictures,
                        removeButton: true,
                        backButton: false,
                        avatarGallery: false,
                    };
                    break;
                case false:
                    dialogState = {
                        title: "Profile picture",
                        description: `A picture helps people recognize you and lets you know when you're signed in to your account`,

                        avatar: true,
                        tuner: false,
                        preview: false,
                        result: false,
                        uploadButton: !hasPictures,
                        changeButton: hasPictures,
                        removeButton: false,
                        backButton: false,
                        avatarGallery: false,
                    };
                    break;
            }
            break;
        case DialogPage.CHANGE_PICTURE:
            dialogState = {
                title: "Change profile picture",
                description: `A picture helps people recognize you and lets you know when you're signed in to your account`,

                avatar: false,
                tuner: false,
                preview: false,
                result: false,
                uploadButton: true,
                changeButton: false,
                removeButton: false,
                backButton: true,
                avatarGallery: true,
            };
            break;
        case DialogPage.TUNE_PICTURE:
            dialogState = {
                title: "Crop picture",
                description: `Select the area of the picture you want to use`,

                avatar: false,
                tuner: true,
                preview: false,
                result: false,
                uploadButton: false,
                changeButton: false,
                removeButton: false,
                backButton: true,
                avatarGallery: false,
            };
            break;
        case DialogPage.PREVIEW_PICTURE:
            dialogState = {
                title: "Use this picture?",
                description: `This will be your new profile picture`,

                avatar: false,
                tuner: false,
                preview: true,
                result: false,
                uploadButton: false,
                changeButton: false,
                removeButton: false,
                backButton: true,
                avatarGallery: false,
            };
            break;
        case DialogPage.PICTURE_UPDATED:
            dialogState = {
                title: "Profile picture updated",
                description: "",

                avatar: false,
                tuner: false,
                preview: false,
                result: true,
                uploadButton: false,
                changeButton: false,
                removeButton: false,

                backButton: false,
                avatarGallery: false,
            };
            break;
        default:
            checkExhaustiveness(page);
    }

    const handleClickBack = () => {
        switch (page) {
            case DialogPage.HOME:
                break;
            case DialogPage.CHANGE_PICTURE:
                setPage(DialogPage.HOME);
                break;
            case DialogPage.TUNE_PICTURE:
                setPage(DialogPage.CHANGE_PICTURE);
                setLocalFile(null);
                setSelectedImageFromGallery(null);
                break;
            case DialogPage.PREVIEW_PICTURE:
                setPage(DialogPage.TUNE_PICTURE);
                break;
            case DialogPage.PICTURE_UPDATED:
                break;
            default:
                checkExhaustiveness(page);
        }
    };

    const handleClickChange = () => {
        setPage(DialogPage.CHANGE_PICTURE);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        setLocalFile(file);
        setSelectedImageFromGallery(null);
        setPage(DialogPage.TUNE_PICTURE);
    };

    const handleSelectPictureFromGallery = (
        picture: DTO["user"]["getProfilePictures"]["response"]["images"][number]
    ) => {
        setLocalFile(null);
        setSelectedImageFromGallery(picture);
        setPage(DialogPage.TUNE_PICTURE);
    };

    const handleApplyCrop = (crop: Crop) => {
        setCrop(crop);
        setPage(DialogPage.PREVIEW_PICTURE);
    };

    const handleConfirmPicture = async () => {
        if (isUploadingProfilePicture) return;
        try {
            if (localFile) {
                await uploadProfilePicture({ file: localFile, crop });
            } else if (selectedImageFromGallery) {
                await updateProfilePicture({
                    imageId: selectedImageFromGallery.id,
                    crop,
                });
            }

            setPage(DialogPage.PICTURE_UPDATED);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile picture");
        }
    };

    const handleRemovePicture = async () => {
        try {
            await unsetProfilePicture();
            setPage(DialogPage.PICTURE_UPDATED);
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove profile picture");
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setLocalFile(null);
            setSelectedImageFromGallery(null);
            setPage(DialogPage.HOME);
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Avatar className="size-52 cursor-pointer">
                    <AvatarImage
                        src={currentPicture?.medium.publicUrl}
                        alt="Avatar"
                    />
                    {/* TODO: Avatar Loading state */}
                    <AvatarFallback delayMs={500}>
                        <CircleUserRound />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="gap-8 w-auto max-w-none">
                <DialogHeader>
                    <DialogTitle>
                        {dialogState.backButton && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="mr-4"
                                onClick={() => handleClickBack()}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <span>{dialogState.title}</span>
                    </DialogTitle>
                    <DialogDescription>
                        {dialogState.description}
                    </DialogDescription>
                </DialogHeader>
                {dialogState.avatar && (
                    <div className="flex justify-center">
                        <Avatar className="size-52">
                            <AvatarImage
                                src={
                                    currentPicture?.medium.publicUrl ??
                                    undefined
                                }
                            />
                            <AvatarFallback>
                                <CameraOff />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
                {dialogState.avatarGallery && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Your pictures</h3>
                        <AvatarGallery
                            onSelect={handleSelectPictureFromGallery}
                        />
                    </div>
                )}
                {dialogState.tuner && selectedImageUrl && (
                    <AvatarTuner
                        onSave={handleApplyCrop}
                        imageSrc={selectedImageUrl}
                    />
                )}
                {dialogState.preview && selectedImageUrl && (
                    <div className="flex gap-4">
                        <CroppedImage
                            className="w-[500px] h-[500px] rounded-lg"
                            crop={crop}
                            src={selectedImageUrl}
                        />
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-semibold">Large</h4>
                                <CroppedImage
                                    className="w-[200px] h-[200px] rounded-full"
                                    crop={crop}
                                    src={selectedImageUrl}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-semibold">
                                    Medium
                                </h4>
                                <CroppedImage
                                    className="w-[40px] h-[40px] rounded-full"
                                    crop={crop}
                                    src={selectedImageUrl}
                                />
                            </div>
                            <div className="grow" />
                            <Button
                                className=""
                                onClick={() => handleConfirmPicture()}
                            >
                                <Icon
                                    icon={Sparkles}
                                    loading={
                                        isUploadingProfilePicture ||
                                        isUpdatingProfilePicture
                                    }
                                    className="mr-2 h-4 w-4"
                                />
                                <span>Use this picture</span>
                            </Button>
                        </div>
                    </div>
                )}
                {dialogState.result && (
                    <div className="p-4 justify-center">
                        <Avatar className="size-52 cursor-pointer">
                            <AvatarImage
                                src={currentPicture?.medium.publicUrl}
                                alt="Avatar"
                            />
                            <AvatarFallback
                                delayMs={500}
                                className="animate-pulse"
                            >
                                <CircleUserRound />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
                <DialogFooter className="flex">
                    {dialogState.uploadButton && (
                        <>
                            <Button asChild>
                                <label htmlFor="file" className="grow">
                                    <Upload className="mr-2 h-4 w-4" />
                                    <span>Upload new picture</span>
                                </label>
                            </Button>
                            <input
                                className="hidden"
                                id="file"
                                name="file"
                                accept="image/*cvx"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                    {dialogState.changeButton && (
                        <Button
                            className="grow"
                            onClick={() => handleClickChange()}
                        >
                            <Pen className="mr-2 h-4 w-4" />
                            <span>Change picture</span>
                        </Button>
                    )}
                    {dialogState.removeButton && (
                        <Button
                            className="grow"
                            onClick={() => handleRemovePicture()}
                        >
                            <Icon
                                icon={Trash}
                                loading={isRemovingProfilePicture}
                                className="mr-2 h-4 w-4"
                            />
                            <span>Remove picture</span>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
