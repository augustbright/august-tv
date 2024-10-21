'use client';

import { getMediaById } from '@/api/media';
import { Query } from '@/components/Query';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { useRouter } from 'next/navigation';

import { EditVideoForm } from './edit-video-form';

export const EditVideoModal = ({ videoId }: { videoId: string }) => {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push('/profile/my-videos');
    }
  };
  return (
    <Dialog
      open
      onOpenChange={handleOpenChange}
    >
      <DialogContent className='max-w-5xl h-[600px] flex flex-col overflow-hidden'>
        <Query
          query={getMediaById.query({ mediaId: videoId })}
          loading={Query.LOADING.ROW}
          error={Query.ERROR.ALERT}
        >
          {({ data: video }) => <EditVideoForm video={video} />}
        </Query>
      </DialogContent>
    </Dialog>
  );
};

export const useEditVideoModal = () => {
  const router = useRouter();
  return (videoId: string) => {
    router.push(`/profile/my-videos/edit/${videoId}`, {
      scroll: false
    });
  };
};
