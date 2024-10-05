'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryMedia } from '@/queries/media';
import moment from 'moment';

export const MediaInfo = ({ mediaId }: { mediaId: string }) => {
  const { data: media, isLoading } = useQueryMedia(mediaId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!media) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold md:text-2xl">{media.title}</h1>
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {moment(media.createdAt).format('MMMM Do, YYYY')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{media.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};
