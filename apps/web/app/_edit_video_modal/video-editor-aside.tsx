import { getMediaById } from '@/api/media';
import { Query } from '@/components/Query';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';

import { SwitchVideoStatus } from './switch-video-status';

export const VideoEditorAside = ({ mediaId }: { mediaId: string }) => {
  const playerRef = useRef<HTMLVideoElement>(null);
  return (
    <div className='flex-col items-start flex gap-4'>
      <Label>Preview</Label>
      <Query query={getMediaById.query({ mediaId })}>
        {({ data: video }) => (
          <SwitchVideoStatus
            mediaId={mediaId}
            processing={
              <Skeleton className='w-full aspect-video rounded-lg flex justify-center items-center text-gray-500'>
                <Loader2 className='animate-spin h-3' />
                <p className='text-sm'>Your video is being processed</p>
              </Skeleton>
            }
            ready={
              <>
                {video.master && (
                  <ReactHlsPlayer
                    className='w-full rounded-lg aspect-video'
                    src={video.master.publicUrl}
                    playerRef={playerRef}
                    controls
                  />
                )}
                <div>
                  <div>
                    <p className='text-sm text-gray-500'>Link to the video</p>
                  </div>
                  <Link
                    href={`/v/${video.id}`}
                    className='text-sm underline font-bold text-blue-600'
                  >
                    {location.origin}/v/{video.id}
                  </Link>
                </div>
              </>
            }
          />
        )}
      </Query>
    </div>
  );
};
