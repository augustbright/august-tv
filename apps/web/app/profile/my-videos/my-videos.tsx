'use client';

import { Query } from '@/components/Query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { queryMyMedia } from '@/queries/myMedia';

import { EmptyPlaceholder } from './empty-placeholder';
import { VideoRow } from './video-row';

export const MyContent = () => {
  return (
    <Card x-chunk='dashboard-06-chunk-0'>
      <CardHeader>
        <CardTitle>My Videos</CardTitle>
        <CardDescription>
          Manage your videos and view their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Query
          query={queryMyMedia()}
          loading={Query.LOADING.ROW}
          error={Query.ERROR.ALERT}
        >
          {({ data: { data: items } }) =>
            items.length === 0 ? (
              <EmptyPlaceholder />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[200px] sm:table-cell'>
                      <span className='sr-only'>Preview</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((video) => (
                    <VideoRow
                      key={video.id}
                      video={video}
                    />
                  ))}
                </TableBody>
              </Table>
            )
          }
        </Query>
      </CardContent>
      <CardFooter>
        <div className='text-xs text-muted-foreground'>
          {/* Showing <strong>1-10</strong> of <strong>32</strong> products */}
        </div>
      </CardFooter>
    </Card>
  );
};
