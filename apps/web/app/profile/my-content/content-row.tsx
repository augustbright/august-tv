import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { TVideoDto } from 'types';
import Image from 'next/image';
import { useEditVideoModal } from '@/app/_edit_video_modal/edit-video.modal';
import Link from 'next/link';

export const ContentRow = ({ video }: { video: TVideoDto }) => {
  const editVideo = useEditVideoModal();
  return (
    <TableRow
      onClick={() => {
        editVideo(video.id);
      }}
    >
      <TableCell className="hidden sm:table-cell">
        <Image
          src={video.thumbnailUrl || ''}
          width={200}
          height={100}
          alt={video.title}
        />
      </TableCell>
      <TableCell className="font-medium">
        <Link
          href={`/v/${video.id}`}
          className="text-sm underline font-bold text-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          {video.title}
        </Link>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{video.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(video.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
