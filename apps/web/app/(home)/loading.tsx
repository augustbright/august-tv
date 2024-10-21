import { VideosSkeleton } from '@/components/skeletons/videos-skeleton';

export default function Loading() {
  return (
    <div className='flex flex-col gap-4 grow'>
      <div className='flex flex-col gap-4'>
        <VideosSkeleton />
      </div>
    </div>
  );
}
