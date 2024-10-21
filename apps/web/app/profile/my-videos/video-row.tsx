import { deleteMedia } from '@/api/media';
import { useEditVideoModal } from '@/app/_edit_video_modal/edit-video.modal';
import { useConfirm } from '@/app/confirm';
import { ThumbnailPicture } from '@/components/thumbnail-picture';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { File, Video } from '@prisma/client';

import { Loader, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';

export const VideoRow = ({
  video
}: {
  video: Video & { thumbnail: { medium: File } | null };
}) => {
  const editVideo = useEditVideoModal();
  const confirm = useConfirm();
  const { mutateAsync: deleteVideoById, isPending: isDeletingVideo } =
    deleteMedia.useMutation();
  return (
    <TableRow
      onClick={() => {
        if (isDeletingVideo) return;
        editVideo(video.id);
      }}
    >
      <TableCell className='hidden sm:table-cell'>
        {video.status === 'ERROR' && (
          <p className='flex w-[200px] aspect-video justify-center items-center text-gray-500'>
            Preview is not available
          </p>
        )}
        {video.status !== 'ERROR' && (
          <ThumbnailPicture
            thumbnail={video.thumbnail}
            alt={video.title}
          />
        )}
      </TableCell>
      <TableCell className='font-medium'>
        {video.status === 'READY' ? (
          <Link
            href={`/v/${video.id}`}
            className='text-sm underline font-bold text-blue-600'
            onClick={(e) => e.stopPropagation()}
          >
            {video.title}
          </Link>
        ) : (
          video.title
        )}
      </TableCell>
      <TableCell>
        <Badge variant={video.status === 'ERROR' ? 'destructive' : 'outline'}>
          {video.status === 'PROCESSING' && (
            <Loader className='mr-2 w-3 h-3 animate-spin' />
          )}
          {video.status}
        </Badge>
      </TableCell>
      <TableCell className='hidden md:table-cell'>
        {new Date(video.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup='true'
              size='icon'
              variant='ghost'
            >
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive'
              onClick={(e) => {
                e.stopPropagation();
                confirm({
                  description: 'This video will be deleted permanently.',
                  continueText: 'Delete',
                  onContinue: () => {
                    deleteVideoById({ mediaId: video.id });
                  }
                });
              }}
            >
              <Trash className='w-4 h-4 mr-2' />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
