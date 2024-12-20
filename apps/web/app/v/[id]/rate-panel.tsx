import { getMediaById, postMediaRate } from '@/api/media';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TVideoEndpointResult } from '@august-tv/generated-types';
import { useQueryClient } from '@tanstack/react-query';

import anime from 'animejs';
import {
  FlagTriangleRight,
  MoreVertical,
  Save,
  Share2,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const RatePanel = ({ mediaId }: { mediaId: string }) => {
  const { mutateAsync: rate, isPending: isRating } =
    postMediaRate.useMutation();
  const queryClient = useQueryClient();

  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const likeEffectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queryClient.fetchQuery(getMediaById.query({ mediaId })).then((video) => {
      setLikesCount(video.likesCount);
      setDislikesCount(video.dislikesCount);
      if (video.rates[0]?.type === 'LIKE') {
        setIsLiked(true);
        setIsDisliked(false);
      }
      if (video.rates[0]?.type === 'DISLIKE') {
        setIsLiked(false);
        setIsDisliked(true);
      }
      if (!video.rates[0]?.type) {
        setIsLiked(false);
        setIsDisliked(false);
      }
    });
  }, [mediaId, queryClient]);

  const updateFromData = (data: TVideoEndpointResult<'rateMedia'>) => {
    setLikesCount(data.likesCount);
    setDislikesCount(data.dislikesCount);
    if (data.type === 'LIKE') {
      setIsLiked(true);
      setIsDisliked(false);
    }
    if (data.type === 'DISLIKE') {
      setIsLiked(false);
      setIsDisliked(true);
    }
    if (!data.type) {
      setIsLiked(false);
      setIsDisliked(false);
    }
  };

  const handleClickLike = async () => {
    if (isRating) return;
    if (!isLiked) {
      anime({
        targets: likeEffectRef.current,
        keyframes: [
          {
            duration: 0,
            scale: 1,
            opacity: 1
          },
          {
            easing: 'easeOutQuart',
            duration: 1000,
            scale: 6,
            opacity: 0
          }
        ]
      });
    }
    setIsLiked(!isLiked);
    setIsDisliked(false);
    setLikesCount(likesCount + (isLiked ? -1 : 1));
    setDislikesCount(isDisliked ? dislikesCount - 1 : dislikesCount);
    const newData = await rate({
      mediaId,
      type: isLiked ? null : 'LIKE'
    });
    updateFromData(newData);
  };
  const handleClickDislike = async () => {
    if (isRating) return;
    setIsLiked(false);
    setIsDisliked(!isDisliked);
    setDislikesCount(dislikesCount + (isDisliked ? -1 : 1));
    setLikesCount(isLiked ? likesCount - 1 : likesCount);
    const newData = await rate({
      mediaId,
      type: isDisliked ? null : 'DISLIKE'
    });
    updateFromData(newData);
  };

  return (
    <Card className='flex p-2'>
      <Button variant='ghost'>
        <Share2 className='w-6 h-6 mr-3' />
        <span>Share</span>
      </Button>
      <Button
        variant='ghost'
        onClick={handleClickLike}
      >
        <div
          ref={likeEffectRef}
          className='absolute w-5 h-5 opacity-0 pointer-events-none bg-transparent'
        >
          <ThumbsUp
            fill={isLiked ? 'white' : ''}
            className='w-6 h-6 transform -translate-x-1 -translate-y-2'
          />
        </div>
        <ThumbsUp
          fill={isLiked ? 'white' : ''}
          className='w-6 h-6 mr-3'
        />
        <span>{likesCount}</span>
      </Button>
      <Button
        variant='ghost'
        onClick={handleClickDislike}
      >
        <ThumbsDown
          fill={isDisliked ? 'white' : ''}
          className='w-6 h-6  mr-3'
        />
        <span>{dislikesCount}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-haspopup='true'
            size='icon'
            variant='ghost'
          >
            <MoreVertical className='h-4 w-4' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>More</DropdownMenuLabel>
          <DropdownMenuItem className='flex gap-2'>
            <Save className='w-4 h-4 mr-2' />
            <span>Save</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='flex gap-2'>
            <FlagTriangleRight className='w-4 h-4' />
            <span>Report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};
