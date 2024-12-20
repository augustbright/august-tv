import { FileVideo } from 'lucide-react';
import Image from 'next/image';

export const ThumbnailPicture = ({
  thumbnail,
  width = 200,
  height = 200,
  alt,
  className
}: {
  thumbnail: {
    medium: {
      publicUrl: string;
    };
  } | null;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      {thumbnail ? (
        <Image
          style={{ width }}
          src={thumbnail.medium?.publicUrl}
          width={width}
          height={height}
          alt={alt}
          className='rounded-lg aspect-video'
        />
      ) : (
        <div
          style={{ width }}
          className={`aspect-video flex justify-center items-center dark:bg-slate-900 bg-slate-100 rounded-lg max-w-full`}
        >
          <FileVideo className='w-4 h-4' />
        </div>
      )}
    </div>
  );
};
