import { getMediaThumbnails } from '@/api/media';
import { Query } from '@/components/Query';
import { ThumbnailPicture } from '@/components/thumbnail-picture';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { Play, Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';

export const VideoEditorPlayer = ({
  className,
  src,
  mediaId,
  selectedThumbnailId
}: {
  className?: string;
  src: string;
  mediaId: string;
  selectedThumbnailId: string | undefined;
}) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    setIsActivated(false);
  }, [selectedThumbnailId]);

  if (!isActivated) {
    return (
      <Query query={getMediaThumbnails.query({ mediaId })}>
        {({
          data: {
            thumbnailSet: { images: generatedThumbnails },
            customThumbnailSet
          }
        }) => {
          const thumbnails = [
            ...generatedThumbnails,
            ...(customThumbnailSet?.images ?? [])
          ];
          const selectedThumbnail = thumbnails.find(
            (thumbnail) => thumbnail.id === selectedThumbnailId
          );
          return (
            <div
              className='relative group cursor-pointer'
              role='button'
              onClick={() => {
                setIsActivated(true);
              }}
            >
              <ThumbnailPicture
                thumbnail={selectedThumbnail ?? thumbnails[0]}
                width={selectedThumbnail?.originalWidth}
                alt='Vide preview'
              />
              <div
                className={cn(
                  'bg-opacity-0 group-hover:bg-opacity-50',
                  'absolute inset-0 bg-black transition-opacity duration-200'
                )}
              >
                <div
                  className={cn(
                    'hidden group-hover:flex',
                    'justify-center items-center h-full gap-2'
                  )}
                >
                  <Play className='w-6 h-6 text-white' />
                  <Label className='text-white text-lg'>Watch</Label>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      <ReactHlsPlayer
        className={className}
        src={src}
        playerRef={playerRef}
        controls
        autoPlay
      />
      <Button
        variant='link'
        className='text-sm text-gray-500'
        onClick={() => {
          setIsActivated(false);
        }}
      >
        <Undo2 className='h-3' />
        Show thumbnail
      </Button>
    </div>
  );
};
