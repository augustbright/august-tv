import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { TVideoDto } from 'types';

export const VideoThumbnail = ({ video }: { video: TVideoDto }) => {
  return (
    <Link
      href={`/v/${video.id}`}
      className="display: flex flex-col gap-2 hover:bg-slate-200 dark:hover:bg-slate-900 p-4 rounded-lg"
    >
      <Image
        src={video.thumbnailUrl || ''}
        alt={video.title}
        width={400}
        height={400}
        className="rounded-lg"
      />
      <h3 className="text-lg font-semibold">{video.title}</h3>
      <p className="text-sm">
        {moment(video.createdAt).format('MMMM Do, YYYY')}
      </p>
    </Link>
  );
};
