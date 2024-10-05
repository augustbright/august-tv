'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, Plus, Upload, Loader } from 'lucide-react';
import { ChangeEvent } from 'react';
import { useMutateUploadMedia } from '@/mutations/uploadMedia';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const AppUploadButton = () => {
  const uploadMedia = useMutateUploadMedia();
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const result = await uploadMedia.mutateAsync(file);
    console.log(result);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      uploadMedia.reset();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <span>Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a video</DialogTitle>
          <DialogDescription>
            Choose a video file from your device to upload.
          </DialogDescription>
        </DialogHeader>
        <Button asChild>
          <label htmlFor="file">
            <Upload className="mr-2 h-4 w-4" />
            <span>Choose file</span>
          </label>
        </Button>
        {uploadMedia.isPending && (
          <Alert variant="default">
            <Loader className="h-4 w-4 animate-spin" />
            <AlertTitle>Uploading...</AlertTitle>
            <AlertDescription>Your video is being uploaded</AlertDescription>
          </Alert>
        )}
        {uploadMedia.error && !uploadMedia.isPending && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadMedia.error.message}</AlertDescription>
          </Alert>
        )}
        <input
          className="hidden"
          id="file"
          name="file"
          accept="video/*"
          type="file"
          onChange={handleFileChange}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
