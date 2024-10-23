import { getMediaThumbnails } from '@/api/media';
import { Query } from '@/components/Query';
import { TWithInputProps } from '@/components/types/with-input-props.type';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import Image from 'next/image';

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
  return (
    <div className={cn(className)}>
      <div className={cn('grid grid-cols-4 gap-3')}>
        <Query query={getMediaThumbnails.query({ mediaId })}>
          {({ data: thumbnails }) =>
            thumbnails.map((thumbnail) => (
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
                  <Label className='text-lg select-none cursor-pointer'>
                    Use
                  </Label>
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
                  <Label className='text-lg select-none cursor-pointer'>
                    Current
                  </Label>
                </div>
              </div>
            ))
          }
        </Query>
      </div>
    </div>
  );
};
