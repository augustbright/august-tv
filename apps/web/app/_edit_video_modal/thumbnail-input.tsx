import { getMediaThumbnails, postMediaUploadThumbnail } from '@/api/media';
import { Query } from '@/components/Query';
import { toast } from '@/components/hooks/use-toast';
import { Icon } from '@/components/icon';
import { TWithInputProps } from '@/components/types/with-input-props.type';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { ImageUp } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Crop } from 'react-image-crop';

import { AvatarTuner } from '../profile/general/avatar-tuner';

type TProps = {
  mediaId: string;
  className?: string;
} & TWithInputProps<string>;

export const ThumbnailInput = ({
  mediaId,
  onChange,
  value,
  className
}: TProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const localFileUrl = useMemo(
    () => (localFile ? URL.createObjectURL(localFile) : null),
    [localFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setLocalFile(file);
  };

  const { mutateAsync: uploadThumbnail, isPending: isUploadingThumbnail } =
    postMediaUploadThumbnail.useMutation();

  const handleSaveLocalFile = async (crop: Crop) => {
    if (!localFile) return;
    try {
      const newThumbnail = await uploadThumbnail({
        mediaId,
        file: localFile,
        crop: {
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height)
        }
      });
      onChange({
        target: {
          value: newThumbnail.id
        }
      });
      setLocalFile(null);
      if (fileInputRef.current?.value) {
        fileInputRef.current.value = '';
      }
      toast.success('Thumbnail uploaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to upload thumbnail');
    }
  };

  const renderThumbnail = (thumbnail: {
    id: string;
    originalWidth: number;
    originalHeight: number;
    medium: {
      publicUrl: string;
    };
  }) => (
    <div
      key={thumbnail.id}
      className='relative col-span-1 group cursor-pointer'
      onClick={() =>
        onChange({
          target: {
            value: thumbnail.id
          }
        })
      }
      role='button'
    >
      <Image
        style={{
          width: thumbnail.originalWidth
        }}
        src={thumbnail.medium?.publicUrl}
        width={thumbnail.originalWidth}
        height={thumbnail.originalHeight}
        alt='Thumbnail'
        className='rounded-lg aspect-video'
      />
      <div
        className={cn(
          'hidden',
          'absolute inset-0',
          'justify-center items-center',
          'group-hover:bg-black group-hover:bg-opacity-50',
          { ['group-hover:flex']: value !== thumbnail.id }
        )}
      >
        <Label className='text-lg select-none cursor-pointer'>Use</Label>
      </div>
      <div
        className={cn(
          'hidden',
          'absolute inset-0',
          'justify-center items-center',
          'bg-black bg-opacity-50',
          { flex: value === thumbnail.id }
        )}
      >
        <Label className='text-lg select-none cursor-pointer'>Current</Label>
      </div>
    </div>
  );

  return (
    <div className={cn(className)}>
      <div className={cn('grid grid-cols-4 gap-3')}>
        <Query query={getMediaThumbnails.query({ mediaId })}>
          {({
            data: {
              thumbnailSet: { images: generatedThumbnails },
              customThumbnailSet
            }
          }) => (
            <>
              {customThumbnailSet || isUploadingThumbnail ? (
                <>
                  <Label className='col-span-4 text-sm text-gray-500'>
                    Custom
                  </Label>
                  {customThumbnailSet?.images.map(renderThumbnail)}
                  {isUploadingThumbnail && (
                    <Skeleton className='col-span-1 aspect-video' />
                  )}
                </>
              ) : null}
              <Label className='col-span-4 text-sm text-gray-500'>
                Generated
              </Label>
              {generatedThumbnails.map(renderThumbnail)}
              <div
                className={cn(
                  'col-span-4 flex flex-col justify-center items-center'
                )}
              >
                <Separator className='w-1/2 my-3' />
                <Button
                  disabled={isUploadingThumbnail}
                  asChild
                >
                  <label
                    htmlFor='file'
                    className='grow cursor-pointer'
                  >
                    <Icon
                      icon={ImageUp}
                      loading={isUploadingThumbnail}
                      className='mr-2 h-4 w-4'
                    />
                    Upload Custom Thumbnail
                  </label>
                </Button>
                <input
                  ref={fileInputRef}
                  className='hidden'
                  id='file'
                  name='file'
                  accept='image/*'
                  type='file'
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
        </Query>
      </div>

      <Dialog
        open={!!localFile}
        onOpenChange={(open) => {
          if (!open) {
            setLocalFile(null);
            if (fileInputRef.current?.value) {
              fileInputRef.current.value = '';
            }
          }
        }}
      >
        <DialogContent className='w-[1000px] max-w-full max-h-screen'>
          <DialogHeader>Upload Custom Thumbnail</DialogHeader>
          {localFileUrl && (
            <AvatarTuner
              imageSrc={localFileUrl}
              onSave={handleSaveLocalFile}
              aspect={16 / 9}
              circularCrop={false}
              minWidth={600}
              minHeight={338}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
