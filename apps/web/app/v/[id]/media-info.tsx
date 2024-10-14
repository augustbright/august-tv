'use client';

import { AuthorPicture } from '@/components/AuthorPicture';
import { Query } from '@/components/Query';
import { SubscribeButton } from '@/components/subscribe-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { queryMedia } from '@/queries/media';

import { ChartNoAxesCombined, Edit } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';

import { RatePanel } from './rate-panel';

export const MediaInfo = ({ mediaId }: { mediaId: string }) => {
  const { current } = useUser();
  return (
    <div className='flex flex-col gap-2'>
      <Query
        query={queryMedia(mediaId)}
        loading={Query.LOADING.ROW}
        error={Query.ERROR.ALERT}
      >
        {({ data: media }) => (
          <>
            <h1 className='text-lg font-semibold md:text-2xl'>{media.title}</h1>
            <div className='flex gap-4'>
              <div className='flex py-2 gap-4'>
                <AuthorPicture author={media.author} />
                <div className='flex flex-col'>
                  <p className='text'>{media.author.nickname}</p>
                  <p className='text-sm text-gray-500'>
                    {media.author.subscribersCount} subscribers
                  </p>
                </div>
                {current?.data?.id !== media.author.id && (
                  <SubscribeButton authorId={media.author.id} />
                )}
              </div>
              <div className='grow' />
              {current?.data?.id === media.author.id && (
                <Card className='p-2'>
                  <Link href={`/profile/my-videos/edit/${mediaId}`}>
                    <Button variant='ghost'>
                      <Edit className='h-4 mr-2' />
                      Edit
                    </Button>
                  </Link>
                  <Button variant='ghost'>
                    <ChartNoAxesCombined className='h-4 mr-2' />
                    Statistics
                  </Button>
                </Card>
              )}
              <RatePanel mediaId={media.id} />
            </div>
            <Card x-chunk='dashboard-01-chunk-0'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {moment(media.createdAt).format('MMMM Do, YYYY')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-xs text-muted-foreground'>
                  {media.description}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </Query>
    </div>
  );
};
