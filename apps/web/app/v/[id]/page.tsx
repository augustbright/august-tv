import { MediaInfo } from './media-info';
import { MediaPlayer } from './media-player';
import { VideAside } from './video-aside';

export default function Index({ params }: { params: { id: string } }) {
  return (
    <main className='grid grid-cols-12 gap-2'>
      <div className='col-span-9 flex flex-col gap-2'>
        <MediaPlayer mediaId={params.id} />
        <MediaInfo mediaId={params.id} />
      </div>
      <VideAside className='col-span-3' />
    </main>
  );
}
