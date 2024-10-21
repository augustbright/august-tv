'use client';

import { getMediaById } from '@/api/media';
import { Query } from '@/components/Query';

import { useRef } from 'react';
import ReactHlsPlayer from 'react-hls-player';

export const MediaPlayer = ({ mediaId }: { mediaId: string }) => {
  const playerRef = useRef<HTMLVideoElement>(null);

  return (
    <Query
      query={getMediaById.query({ mediaId })}
      loading={Query.LOADING.ROW}
      error={Query.ERROR.ALERT}
    >
      {({ data: media }) => (
        <ReactHlsPlayer
          className='h-[600px] rounded-lg aspect-video'
          src={media.master?.publicUrl || ''}
          playerRef={playerRef}
          controls
          autoPlay
        />
      )}
    </Query>
  );
};
