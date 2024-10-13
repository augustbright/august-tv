"use client";
import { Button } from "@/components/ui/button";
import { useMutateUploadRandomFromYoutube } from "@/mutations/uploadRandomFromYoutube";

export const UploadFromYoutube = () => {
    const { mutateAsync, isPending } = useMutateUploadRandomFromYoutube();
    const handleUpload = async () => {
        await mutateAsync("ywpFCFwEJzVdutyDFnYKXYkc9hq1");
    };
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Upload from Youtube</h1>
            <Button disabled={isPending} onClick={handleUpload}>
                Upload
            </Button>
        </div>
    );
};
