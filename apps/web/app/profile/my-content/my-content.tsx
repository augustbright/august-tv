'use client';

import { useQueryMyMedia } from '@/queries/myMedia';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContentRow } from './content-row';

export const MyContent = () => {
  const { data: myMedia, isLoading } = useQueryMyMedia();
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>My Content</CardTitle>
        <CardDescription>
          Manage your videos and view their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[200px] sm:table-cell">
                <span className="sr-only">Preview</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {myMedia?.data.map((video) => (
              <ContentRow key={video.id} video={video} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {/* Showing <strong>1-10</strong> of <strong>32</strong> products */}
        </div>
      </CardFooter>
    </Card>
  );
};
