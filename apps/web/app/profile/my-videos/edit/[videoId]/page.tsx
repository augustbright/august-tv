'use client';

import { EditVideoModal } from '@/app/_edit_video_modal/edit-video.modal';

import { useParams } from 'next/navigation';

export default function Page() {
  const { videoId } = useParams<{ videoId: string }>();
  return <EditVideoModal videoId={videoId} />;
}
